let merge = require('../../merge');

let App = React.createClass({
	render() {
		let styles = {
			container: {
				height: '100%'
			}
		};

		return (
			<div style={merge(styles.container, this.props.style)}>
				Hi there this is the app page
			</div>
		);
	}
});

React.render(<App />, document.body);
