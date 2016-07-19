const Index = require('./routers/index'),
      Article = require('./routers/article');

module.exports = function(app) {
	
    app.use('/', Index);
    app.user('/article', Article);

};