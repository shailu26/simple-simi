const Router = require('express');
const categoryController = require('./category.controller');
const utils = require('../../helpers/utils');
const router = Router();

router
  .post('/create', utils.validateToken, categoryController.create)
  .get('/categoryList', utils.validateToken, categoryController.categoryList)

module.exports = router;
