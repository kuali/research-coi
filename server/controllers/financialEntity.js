'use strict'
module.exports.init = function(app) {
	app.get('/financialEntity/:id',function*(next){this.body = helloWorld(this.params.id)});
};

module.exports.helloWorld = function helloWorld(id){return "hello world" + id}