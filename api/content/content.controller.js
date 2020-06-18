const Content = require('./content.model');
const Category = require('../category/category.model');

module.exports = {

  'create': async function (req, res) {
    try {
      let categorySchema = await Category.findById(req.body.category).exec();
      console.log({
        categorySchema
      });
      let data = {
        name: req.body.name,
        fileLink: req.body.fileLink,
        category: req.body.category
      };
      let newContent = new Content(data);

      let result = await newContent.save();
      categorySchema.content.push(result);
      categorySchema.save();
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
