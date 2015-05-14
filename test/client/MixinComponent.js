import assert from 'assert';
import {MixinComponent} from '../../client/scripts/MixinComponent';
import React from 'react/addons';
let PureRenderMixin = React.addons.PureRenderMixin;

describe('MixinComponent',function(){
	it('should should fire correct lifecycle events', function(done){
		let didCount = 0;
		let willCount = 0;

		let mixin = {
			componentDidMount() {
				didCount++;
			},

			componentWillMount() {
				willCount++;
			}
		};

		class testClass extends MixinComponent {
			constructor() {
				super([mixin]);
			}

			componentWillMount() {
				willCount++;
				assert.equal(willCount, 2);
				assert.equal(didCount, 0);
				done();
			}

			componentDidMount() {
				didCount++;
				assert.fail('componentDidMount should never have been called');
				done();
			}
		}

		var instanceTest = new testClass();
		instanceTest.componentWillMount();
	});

	it('should call the mixin functions in the right order', function(done){
		let callCount = 0;

		let mixin1 = {
			componentDidMount() {
				assert.equal(callCount, 0);
				callCount++;
			}
		};

		let mixin2 = {
			componentDidMount() {
				assert.equal(callCount, 1);
				callCount++;
			}
		};

		class testClass extends MixinComponent {
			constructor() {
				super([mixin1, mixin2]);
			}

			componentDidMount() {
				assert.equal(callCount, 2);
				done();
			}
		}

		var instanceTest = new testClass();
		instanceTest.componentDidMount();
	});

	it('should pass all mixin params through correctly', function(done) {
		let testProps = {
			color: 'red',
			active: true
		};
		let testState = {
			open: true,
			selected: 3
		};

		let mixin = {
			shouldComponentUpdate(nextProps, nextState) {
				assert.equal(nextProps, testProps);
				assert.equal(nextState, testState);
			}
		};

		class testClass extends MixinComponent {
			constructor() {
				super([mixin]);
			}

			shouldComponentUpdate(nextProps, nextState) {
				assert.equal(nextProps, testProps);
				assert.equal(nextState, testState);
				done();
			}
		}

		var instanceTest = new testClass();

		instanceTest.shouldComponentUpdate(testProps, testState);
	});

	it('should use PureRender correctly', function() {
		class testClass extends MixinComponent {
			constructor() {
				super([PureRenderMixin]);
				this.props = {
					a: 1,
					b: 2
				};
				this.state = {
					active: true
				};
			}
		}

		var instanceTest = new testClass();
		assert(!instanceTest.shouldComponentUpdate({a: 1, b: 2}, {active: true}));
		assert(instanceTest.shouldComponentUpdate({a: 1, b: 3}, {active: true}));
		assert(!instanceTest.shouldComponentUpdate({a: 1, b: 2}, {active: true}));
		assert(instanceTest.shouldComponentUpdate({a: 1, b: 2}, {active: false}));
	});
});