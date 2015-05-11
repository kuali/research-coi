let React = require('react/addons');
let Router = require('react-router');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let RouteHandler = Router.RouteHandler;
let merge = require('../../merge');

let DetailView = require('./DetailView/DetailView');
let ListView = require('./ListView/ListView');

let App = React.createClass({
	render() {
		let styles = {
			container: {
				height: '100%'
			}
		};

		return (
			<div style={merge(styles.container, this.props.style)}>
				<RouteHandler />
			</div>
		);
	}
});

let routes = (
	<Route name="app" path="/" handler={App}>
		<Route name="detailview" path="/detailview" handler={DetailView} />
		<Route name="listview" path="/listview" handler={ListView} />
		<DefaultRoute handler={ListView} />
	</Route>
);

Router.run(routes, (Handler, state) => {
	React.render(<Handler state={state} />, document.body);
});
