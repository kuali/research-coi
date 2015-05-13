const assert = require('assert');
const financialEntity = require('../../server/controllers/financialEntity');

describe('helloWorld_test',function(){
	it ('should return hello world1 when the value is 1', function(){
		assert.equal('hello world1',financialEntity.helloWorld(1));
	});
		it ('should return hello world1 when the value is 2', function(){
		assert.equal('hello world2',financialEntity.helloWorld(2));
		
	});
});