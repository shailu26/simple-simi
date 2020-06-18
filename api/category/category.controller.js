const Category = require('./category.model');
const User = require('../user/user.model');

module.exports = {
  'categoryList': async function (req, res) {
    try {
      let category = await Category.find().populate(['content', 'user']).exec();
      category.forEach(data => {
        if (data.user.userId !== req.decoded.id) {
          delete data;
        }
      })
      return res.status(201).json({
        success: true,
        message: 'successfully fetched',
        category
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

  'create': async function (req, res) {
    try {
      let mongooseUser = await User.findOne({
        userId: req.decoded.id
      }).exec();
      console.log({
        mongooseUser
      });
      let data = {
        categoryName: req.body.name,
        user: mongooseUser._id
      };
      let newCategory = new Category(data);

      let result = await newCategory.save();
      mongooseUser.category.push(result);
      mongooseUser.save();
      return res.status(201).json({
        success: true,
        message: 'successfully created',
        result
      })
    } catch (e) {
      console.log({
        e
      });
      res.status(500).json({
        e
      });
    }
  },
}
