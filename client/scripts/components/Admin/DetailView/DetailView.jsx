import React from 'react/addons';
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';

export class DetailView extends ResponsiveComponent {
	renderMobile() {
		let styles = {
			container: {
			}
		};

		return (
			<span style={merge(styles.container, this.props.style)}>
				Detail View
			</span>
		);
	}

	renderDesktop() {
		let styles = {
			container: {
			}
		};

		return (
			<span style={merge(styles.container, this.props.style)}>
				Detail View
			</span>
		);
	}
}