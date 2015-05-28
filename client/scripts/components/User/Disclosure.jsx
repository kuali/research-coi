import React from 'react/addons';
import {merge} from '../../merge';
import {ResponsiveComponent} from '../ResponsiveComponent';

export class Disclosure extends ResponsiveComponent {
	render() {
		let styles = {
			container: {
			}
		};

		return (
			<span style={merge(styles.container, this.props.style)}>
				Disclosure
			</span>
		);
	}
}