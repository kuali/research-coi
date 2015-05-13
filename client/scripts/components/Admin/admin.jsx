import React from 'react/addons';
import Router from 'react-router';
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let RouteHandler = Router.RouteHandler;
import {merge} from '../../merge';

import {DetailView} from './DetailView/DetailView';
import {ListView} from './ListView/ListView';

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
