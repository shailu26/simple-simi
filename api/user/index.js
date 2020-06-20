const Router = require('express');
const userController = require('./user.controller');
const utils = require('../../helpers/utils');
const router = Router();

router
  .post('/login', utils.verifyLogin)
  .post('/createUser', utils.bycryptPassword, userController.createUser)
  .get('/getUserDetail/:userId', utils.validateToken, userController.getUserDetail)
  .get('/getCurrentUser', utils.validateToken, userController.getCurrentUser)
  .post('/getPresignedUrl',utils.validateToken, userController.getPresignedUrl)
  .get('/auth/google/success', function(req, res) {
    console.log(res, req);
    res.redirect('https://localhost:4200/login?success=true&token=')
  })
  .get('/auth/google/failure', function(req, res) {
    console.log(res);
    res.redirect('https://localhost:4200/login?sucess=false')
  })
  module.exports = router;
