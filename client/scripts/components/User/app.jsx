let React = require('react/addons');
let Router = require('react-router');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let RouteHandler = Router.RouteHandler;
let merge = require('../../merge');

let Dashboard = require('./Dashboard/Dashboard');
let Disclosure = require('./Disclosure');
let Archive = require('./Archive/Archive');

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
		<Route name="dashboard" path="/dashboard" handler={Dashboard} />
		<Route name="disclosure" path="/disclosure" handler={Disclosure} />
		<Route name="archive" path="/archive" handler={Archive} />
		<DefaultRoute handler={Dashboard} />
	</Route>
);

Router.run(routes, (Handler, state) => {
	React.render(<Handler state={state} />, document.body);
});
