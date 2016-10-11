const Index = require('./routers/index'),
      Article = require('./routers/article'),
      API = require('./routers/api.js'),
      Lab = require('./routers/lab.js');

module.exports = function(app) {
	
    app.use('/', Index);
    app.use('/api', API);
    app.use('/article', Article);
    app.use('/lab', Lab);

};