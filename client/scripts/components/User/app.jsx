import React from 'react/addons';
import Router from 'react-router';
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let RouteHandler = Router.RouteHandler;
import {merge} from '../../merge';

import {Dashboard} from './Dashboard/Dashboard';
import {Disclosure} from './Disclosure';
import {Archive} from './Archive/Archive';

let App = React.createClass({
	handleResize(e) {
		window.size = window.innerWidth < 800 ? 'SMALL' : 'LARGE';
		this.forceUpdate();
		console.log('window size: ' + window.size);
	},

	componentWillMount() {
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	},

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
