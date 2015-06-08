import React from 'react/addons';
import {merge} from '../../merge';
import {ResponsiveComponent} from '../ResponsiveComponent';

export class Disclosure extends ResponsiveComponent {
	constructor() {
		super();
		this.commonStyles = {
		};
	}

	renderMobile() {
		let mobileStyles = {
			container: {
			}
		};
		let styles = merge(this.commonStyles, mobileStyles);

		return (
			<span style={merge(styles.container, this.props.style)}>
				Disclosure
			</span>
		);
	}

	renderDesktop() {
		let desktopStyles = {
			container: {
			}
		};
		let styles = merge(this.commonStyles, desktopStyles);

		return (
			<span style={merge(styles.container, this.props.style)}>
				Disclosure
			</span>
		);
	}
}