function helloWorld(id){
	return "hello world" + id;
}

module.exports.init = function(app) {
	app.get('/financialEntity/:id', function*(next){
		this.body = helloWorld(this.params.id);
	});
};

module.exports.helloWorld = helloWorld;