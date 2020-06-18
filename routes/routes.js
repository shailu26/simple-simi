module.exports = { 
    'init': function (app) {
        // Insert routes belo
        app.use('/api/user', require('../api/user'));
        app.use('/api/category', require('../api/category'));
        app.use('/api/content', require('../api/content'));
    }
};
