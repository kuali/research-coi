import React from 'react/addons';
import Router from 'react-router';
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let RouteHandler = Router.RouteHandler;
import {merge} from '../../merge';
import request from 'superagent';

import {Dashboard} from './Dashboard/Dashboard';
import {Disclosure} from './Disclosure';
import {Archive} from './Archive/Archive';
import {AppHeader} from '../AppHeader';
import {SizeAwareComponent} from '../SizeAwareComponent';
import {DisclosureStore} from '../../stores/DisclosureStore';

class App extends SizeAwareComponent {
	constructor() {
		super();
		this.state = DisclosureStore.getState();
	}

	componentDidMount() {
		DisclosureStore.listen(this.onChange.bind(this));
	}

	componentWillUnmount() {
		DisclosureStore.unlisten(this.onChange.bind(this));
	}

	onChange(state) {
		this.setState(state);
	}

	render() {
		let styles = {
			container: {
				height: '100%'
			}
		};

		return (
			<div className="flexbox column" style={merge(styles.container, this.props.style)}>
				<AppHeader homelink="dashboard" />
				<RouteHandler />
			</div>
		);
	}
}

let routes = (
	<Route name="app" path="/" handler={App}>
		<Route name="archiveview" path="/archiveview" handler={Archive} />
		<Route name="dashboard" path="/dashboard" handler={Dashboard} />
		<Route name="disclosure" path="/disclosure" handler={Disclosure} />
		<Route name="archive" path="/archive" handler={Archive} />
		<DefaultRoute handler={Dashboard} />
	</Route>
);

// Then load config and re-render
request.get('/api/research/coi/config', (err, config) => {
	window.config = config.body;
	Router.run(routes, (Handler, state) => {
		React.render(<Handler state={state} />, document.body);
	});
});

