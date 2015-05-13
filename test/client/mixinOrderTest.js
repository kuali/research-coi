var assert = require('assert');
var MixinComponent = require('../../client/scripts/MixinComponent');

var testMixin1 = {
	componentDidMount: function() {
		console.log('test mixin 1: cdm');
	},
	componentWillMount: function() {
		console.log('test mixin 1: cwm');
	}
};

var testMixin2 = {
	componentDidMount: function() {
		console.log('test mixin 2: cdm');
	},
	componentWillMount: function() {
		console.log('test mixin 2: cwm');
	}
};

var testMixin3 = {
	componentDidMount: function() {
		console.log('test mixin 3: cdm');
	},
	componentWillMount: function() {
		console.log('test mixin 3: cwm');
	}
};


describe('mixinArrayOrder_test',function(){
	it ('the mixin functions are registered', function(){
		class testClass extends MixinComponent {
			constructor() {
				super([testMixin1, testMixin2, testMixin3]);
			}
		}

		var instanceTest = new testClass();

		assert.equal(Object.keys(instanceTest._mixins).length, 2);
		assert.equal(instanceTest._mixins['componentDidMount'].length, 3);
		assert.equal(instanceTest._mixins['componentWillMount'].length, 3);

	});

	it ('the mixin functions are registered in the right order', function(){
		class testClass extends MixinComponent {
			constructor() {
				super([testMixin1, testMixin2, testMixin3]);
			}
		}

		var instanceTest = new testClass();

		assert.equal(instanceTest._mixins['componentDidMount'][0], testMixin1.componentDidMount);
		assert.equal(instanceTest._mixins['componentDidMount'][1], testMixin2.componentDidMount);
		assert.equal(instanceTest._mixins['componentDidMount'][2], testMixin3.componentDidMount);

		assert.equal(instanceTest._mixins['componentWillMount'][0], testMixin1.componentWillMount);
		assert.equal(instanceTest._mixins['componentWillMount'][1], testMixin2.componentWillMount);
		assert.equal(instanceTest._mixins['componentWillMount'][2], testMixin3.componentWillMount);

	});
});