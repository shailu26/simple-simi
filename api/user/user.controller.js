const userDataServiceProvider = require("../../services/sql/userDataServiceProvider");
const User = require('./user.model');
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.S3REGION
});

const getSignedUrl = params => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl("putObject", params, function (err, url) {
      if (err) {
        reject(err);
      }
      resolve(url);
    });
  });
};

module.exports = {
  'getUserDetail': function (req, res) {
    const sql = req.app.get('sql');
    let userId = req.params.userId;
    userDataServiceProvider.getUserDetail(sql, userId).then(userDetails => {
      if (userDetails.length) {
        delete userDetails[0].password;
        return res.status(201).json({
          success: true,
          message: 'successfully fetched',
          userDetails: userDetails[0]
        });
      } else {
        return res.status(401).json('Not Authorized')
      }
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        err
      });
    })
  },
  'getCurrentUser': async function (req, res) {
    const userId = req.decoded.id;
    try {
      let user = await User.find({
        userId
      }).select('-password').populate({
        path: "category",
        populate: {
          path: 'content',
          model: 'Content'
        }
      }).exec()
      return res.status(201).json({
        success: true,
        message: 'successfully fetched',
        userDetails: user
      });
    } catch (e) {
      console.log({
        e
      });
      res.status(500).json({
        err
      });
    }

  },

  'createUser': async function (req, res) {
    const sql = req.app.get('sql');
    let isEmailExist = await userDataServiceProvider.isEmailExist(sql, req.body.email);
    if (isEmailExist) {
      res.status(500).json({
        error: {
          'code': 'ER_DUP_ENTRY'
        }
      });
    } else {
      userDataServiceProvider.createUser(sql, req.body).then(async details => {
        let data = {
          fullName: req.body.name,
          email: req.body.email,
          password: req.body.password,
          userId: details.insertId
        };
        let newUser = new User(data);
        let result = await newUser.save();
        console.log({
          result
        });
        return res.status(201).json({
          success: true,
          message: 'successfully created'
        })
      }).catch(err => {
        console.log(err);
        res.status(500).json({
          err: err.code === 'ER_DUP_ENTRY' ? 'Email Address Already Exist' : err
        });
      })
    }
  },
  getPresignedUrl: async (req, res) => {
    console.log(req.body);
    if (
      req.body.bucketName &&
      req.body.bucketName.length &&
      req.body.files &&
      req.body.files.length
    ) {
      const dataToSend = [];
      for (let file of req.body.files) {
        let fileName = `${new Date().getTime()}`;
        const params = {
          Bucket: req.body.bucketName,
          Key: `${req.body.folderName}/${fileName}`,
          Expires: 6000,
          ContentType: file.contentType,
          ACL: "public-read"
        };

        try {
          let signedUrl = await getSignedUrl(params);
          let data = JSON.parse(JSON.stringify(file));
          data.url = signedUrl;
          data.fileName = fileName;
          dataToSend.push(data);
        } catch (error) {
          res.status(500).json({
            error
          });
        }
      }
      res.status(200).send(dataToSend);
    } else {

      res.status(422).json({
        error: "Check if any of these key is missing while passing to this api [bucketName, files(As Array) folderName, userId]"
      });
    }
  }
}
