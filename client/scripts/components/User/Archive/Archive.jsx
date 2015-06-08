import React from 'react/addons';
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';

export class Archive extends ResponsiveComponent {
	constructor() {
		super();
		this.commonStyles = {
		};
	}

	renderMobile() {
		let mobileStyles = {
		};
		let styles = merge(this.commonStyles, mobileStyles);

		return (
			<span style={merge(styles.container, this.props.style)}>
				Archive
			</span>
		);
	}

	renderDesktop() {
		let desktopStyles = {
		};
		let styles = merge(this.commonStyles, desktopStyles);

		return (
			<span style={merge(styles.container, this.props.style)}>
				Archive
			</span>
		);
	}
}