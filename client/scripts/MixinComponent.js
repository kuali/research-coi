let React = require('react/addons');

export class MixinComponent extends React.Component {
	constructor(mixins) {
		super();
		this._mixins = {};

		mixins.forEach(mixin => {
			this.addMixin(mixin);
		});
	}

	addMixin(mixin) {
		let mixinFunctions = Object.keys(mixin);

		mixinFunctions.forEach((lifeCycleEventName) => {
			if (typeof mixin[lifeCycleEventName] === 'function') {
				if (this._mixins[lifeCycleEventName] === undefined) {
					this.registerLifecycleEvent(lifeCycleEventName);
				}

				// Add this mixins function
				this._mixins[lifeCycleEventName].push(mixin[lifeCycleEventName]);
			}
		});
	}

	registerLifecycleEvent(eventName) {
		this._mixins[eventName] = [];

		// Wrap the component's existing implementation
		let componentImplementation = this[eventName];
		this[eventName] = function(...args) {
			// Call each mixin function in order
			for (let i = 0; i < this._mixins[eventName].length; i++) {
				let retVal = this._mixins[eventName][i].bind(this)(...args);
				if (retVal !== undefined) {
					return retVal;
				}
			}

			// Now call the component's implemenation if defined
			if (componentImplementation) {
				return componentImplementation.bind(this)(...args);
			}
		};
	}
}