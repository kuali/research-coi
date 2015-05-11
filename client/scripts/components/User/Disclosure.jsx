let React = require('react/addons');
let PureRenderMixin = React.addons.PureRenderMixin;
let merge = require('../../merge');

module.exports = React.createClass({
	propTypes: {
		style: React.PropTypes.object
	},
	mixins: [PureRenderMixin],
	render() {
		let styles = {
			container: {

			}
		};

		return (
			<span style={merge(styles.container, this.props.style)}>
				Disclosure
			</span>
		);
	}
});