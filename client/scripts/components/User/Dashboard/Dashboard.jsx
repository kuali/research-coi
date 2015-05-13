let React = require('react/addons');
let PureRenderMixin = React.addons.PureRenderMixin;
let merge = require('../../../merge');
let MixinComponent = require('../../../MixinComponent');

class Dashboard extends MixinComponent {
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
				Dashboard
			</span>
		);
	}
}

module.exports = Dashboard;