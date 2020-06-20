const express = require('express')
const app = express()
const cors = require('cors');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const init = require('./routes/routes').init;
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('./api/user/user.model');

dotenv.config()
// Mongo Connection
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;

connection.once('open', () => {
  console.log(`connected to db: ${uri}`)
});

connection.on('error', function (err) {
  console.log("Mongoose default connection has occured " + err + " error");
});
// This event is fired when the process is closed.
process.on('SIGINT', function () {
  connection.close(function () {
    console.log("Mongoose default connection is disconnected due to application termination");
    process.exit(0);
  });
})
app.use(cors(), function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(morgan('dev'))
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cookieParser())
app.use(passport.initialize());

// Add this line below
const jwt = require('jsonwebtoken')

// calling routes
init(app);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken, refreshToken, profile)
    console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED")
    return cb(null, profile)
  }
));

passport.serializeUser(function (user, cb) {
  console.log('I should have jack ')
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  console.log('I wont have jack shit')
  cb(null, obj);
});

app.get('/auth/google/', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
  console.log('redirected', req.user);
  const profile = req.user;
  let user = {
    id: profile.id,
    displayName: req.user.displayName,
    name: req.user.name.givenName,
    email: req.user._json.email,
    provider: req.user.provider
  }
  console.log(user)
  User.update({
    userId: profile.id,
  }, {
    $set: {
      googleId: profile.id,
      fullName: profile.displayName,
      email: req.user._json.email
    }
  }, {
    upsert: true
  }, function (err, data) {
    const payload = {
      email: user.email,
      id: user.id,
      name: user.displayName
    };
    const options = {
      expiresIn: '2d'
    };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, options);
    res.redirect(`http://localhost:4200/login?success=true&token=${token}`)
  });
})


app.get('/', (req, res) => {
  res.send('Welcome');
})
const sqlConnectorHelper = require('./helpers/sqlConnector')

const sqlClient = sqlConnectorHelper()

sqlClient.connect(function (err) {
  if (err) {
    console.log({
      err
    });
  }
  console.log("Database Connected!");
  app.set('sql', sqlClient);
});

module.exports = app
