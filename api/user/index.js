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

  module.exports = router;
