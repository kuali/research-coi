import React from 'react/addons';
import {merge} from '../../../merge';
import {MixinComponent} from '../../../MixinComponent';
let PureRenderMixin = React.addons.PureRenderMixin;

export class Archive extends MixinComponent {
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
				Archive
			</span>
		);
	}
}