let React = require('react/addons');
let PureRenderMixin = React.addons.PureRenderMixin;
let MixinComponent = require('../../../MixinComponent');
let merge = require('../../../merge');

class ListView extends MixinComponent {
	constructor() {
		super([PureRenderMixin]);
	}

	propTypes: {
		style: React.PropTypes.object
	}

	render() {
		let styles = {
			container: {

			}
		};

		return (
			<span style={merge(styles.container, this.props.style)}>
				List View
			</span>
		);
	}
}

module.exports = ListView;