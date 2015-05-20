import React from 'react/addons';
import {merge} from '../../../merge';
let PureRenderMixin = React.addons.PureRenderMixin;

export class Archive extends React.Component {
	constructor() {
		super();
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate;
	}

	render() {
		let styles = {
			container: {

			}
		};

		return (
			<span style={merge(styles.container, this.props.style)}>
				Archive
			</span>
		);
	}
}