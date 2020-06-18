const express = require('express')
const app = express()
const cors = require('cors');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const init = require('./routes/routes').init;
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
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
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(morgan('dev'))
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({
  extended: false
}))

// calling routes
init(app);
app.use(passport.initialize());
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
    passReqToCallback: true
  },
  function (request, accessToken, refreshToken, profile, done) {
    return done(null, profile);

    // User.findOrCreate({
    //   googleId: profile.id
    // }, function (err, user) {
    //   return done(err, user);
    // });
  }
));
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', , 'https://www.googleapis.com/auth/plus.profile.emails.read']
  }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/api/user/auth/google/success',
    failureRedirect: '/api/user/auth/google/failure'
  }))
// app.use(express.static(path.join(__dirname, 'dist')))
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/index.html'));
// });
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
