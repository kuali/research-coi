import React from 'react/addons';
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {NewDisclosureButton} from './NewDisclosureButton';
import {DisclosureArchiveButton} from './DisclosureArchiveButton';
import {FinancialEntitiesButton} from './FinancialEntitiesButton';
import {ConfirmationMessage} from './ConfirmationMessage';
import {DisclosureTable} from './DisclosureTable';

export class Dashboard extends ResponsiveComponent {
	constructor() {
		super();
		this.state = {
		};
	}

	renderMobile() {
		let styles = {
			container: {
				display: 'flex',
				width: '100%',
				background: '#DDD',
				flex: '2',
				flexDirection: 'column'
			},
			sidebar: {
				width: 200,
				display: 'inline-block',
				backgroundColor: '#202020',
				verticalAlign: 'top',
				paddingTop: 125
			},
			content: {
				display: 'inline-block',
				verticalAlign: 'top',
				borderTop: '8px solid ' + window.config.colors.two,
				flex: 1
			},
			header: {
				backgroundColor: 'white',
				padding: '17px 0 17px 50px',
				position: 'relative',
				borderBottom: '1px solid #e3e3e3'
			},
			heading: {
				fontSize: '33px',
				margin: '0 0 0 0',
				textTransform: 'uppercase',
				fontWeight: 300,
				color: window.config.colors.one
			},
			mobileMenu: {
				width: '100%'
			}
		};

		let confirmationMessage;
		if (this.state && this.state.confirmationShowing) {
			confirmationMessage = (
				<ConfirmationMessage />
			);
		}

		return (
			<span style={merge(styles.container, this.props.style)}>
				<span style={styles.content}>
					<div style={styles.header}>
						<h2 style={styles.heading}>MY COI DASHBOARD</h2>
					</div>
					{confirmationMessage}

					<DisclosureTable />
				</span>
				<div style={styles.mobileMenu}>
					<NewDisclosureButton type="Annual" />
					<NewDisclosureButton type="Travel" />
					<NewDisclosureButton type="Manual" />
					<FinancialEntitiesButton />
					<DisclosureArchiveButton />
				</div>
			</span>
		);
	}	

	renderDesktop() {
		let styles = {
			container: {
				display: 'flex',
				width: '100%',
				background: '#DDD',
				flex: '2',
				flexDirection: 'row'
			},
			sidebar: {
				width: 200,
				display: 'inline-block',
				backgroundColor: '#202020',
				verticalAlign: 'top',
				paddingTop: 125
			},
			content: {
				display: 'inline-block',
				verticalAlign: 'top',
				borderTop: '8px solid ' + window.config.colors.two,
				flex: 1
			},
			header: {
				backgroundColor: 'white',
				padding: '17px 0 17px 50px',
				position: 'relative',
				borderBottom: '1px solid #e3e3e3'
			},
			heading: {
				fontSize: '33px',
				margin: '0 0 0 0',
				textTransform: 'uppercase',
				fontWeight: 300,
				color: window.config.colors.one
			}
		};

		let confirmationMessage;
		if (this.state && this.state.confirmationShowing) {
			confirmationMessage = (
				<ConfirmationMessage />
			);
		}

		return (
			<span style={merge(styles.container, this.props.style)}>
				<span style={styles.sidebar}>
					<div>
						<NewDisclosureButton type="Annual" />
					</div>
					<div>
						<NewDisclosureButton type="Travel" />
					</div>
					<div>
						<NewDisclosureButton type="Manual" />
					</div>
					<div>
						<FinancialEntitiesButton />
					</div>
					<div>
						<DisclosureArchiveButton />
					</div>
				</span>
				<span style={styles.content}>
					<div style={styles.header}>
						<h2 style={styles.heading}>MY COI DASHBOARD</h2>
					</div>
					{confirmationMessage}

					<DisclosureTable />
				</span>
			</span>
		);
	}
}