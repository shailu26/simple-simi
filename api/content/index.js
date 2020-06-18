const Router = require('express');
const contentController = require('./content.controller');
const utils = require('../../helpers/utils');
const router = Router();

router
  .post('/create', utils.validateToken, contentController.create)

module.exports = router;
