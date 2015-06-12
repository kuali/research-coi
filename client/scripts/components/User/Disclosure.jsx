import React from 'react/addons';
import {merge} from '../../merge';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {Sidebar} from './Sidebar';
import {DisclosureHeader} from './DisclosureHeader';
import {ProgressIndicator} from './ProgressIndicator';

export class Disclosure extends ResponsiveComponent {
	constructor(props) {
		super(props);
		this.commonStyles = {
		};

		// Set up steps for the sidebar
		this.steps = [
			{label: 'Questionnaire'},
			{label: 'Financial Entities'}
		];
		if (props.disclosuretype && props.disclosuretype.toLowerCase() === 'manual') {
			this.steps.push({label: 'Manual Event'});
		}
		if (props.disclosuretype && props.disclosuretype.toLowerCase() === 'travel') {
			this.steps.push({label: 'Travel Info'});
		}
		else {
			this.steps.push({label: 'Project Declarations'});
		}
		this.steps.push({label: 'Certification'});

		this.state = {percent:0};

		this.advance = this.advance.bind(this);
	}

	advance() {
		this.setState({percent:this.state.percent+9})
	}

	renderMobile() {
		let mobileStyles = {
			container: {
				flex: '1',
				flexDirection: 'column',
				display: 'flex',
				height: 0,
				position: 'relative'
			},
			content: {
				backgroundColor: '#E8E9E6',
				flex: 1
			}
		};
		let styles = merge(this.commonStyles, mobileStyles);

		return (
			<div style={merge(styles.container, this.props.style)}>
				<Sidebar steps={this.steps} activestep={2} />
				<DisclosureHeader>Financial Entities</DisclosureHeader>
				<div style={styles.content}>
					Disclosure stuff will be here
				</div>
			</div>
		);
	}

	renderDesktop() {
		let currentQuestion = 2;

		let desktopStyles = {
			container: {
				flex: '1',
				padding: '0',
				display: 'flex',
				flexDirection: 'row'
			},
			content: {
				flex: '1',
				verticalAlign: 'top',
				width: '80%',
				display: 'inline-block',
				overflow: 'auto',
				borderTop: '8px solid ' + window.config.colors.two
			},
			navigation: {
				verticalAlign: 'top',
				width: '25%',
				display: 'inline-block',
				paddingTop: 55,
				textAlign: 'center'
			},
			prevquestion: {
				margin: '14px 0 14px 0',
				fontSize: 15,
				cursor: 'pointer',
				color: window.config.colors.one,
				display: currentQuestion <= 1 && currentDisclosureStep === COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE ? 'none' : 'block'
			},
			nextquestion: {
				margin: '14px 0 14px 0',
				fontSize: 15,
				cursor: 'pointer',
				color: window.config.colors.one
			},
			middle: {
				width: '75%',
				display: 'inline-block'
			},
			sidebar: {
				width: 258
			}
		};
		let styles = merge(this.commonStyles, desktopStyles);

		return (
			<div style={merge(styles.container, this.props.style)}>
				<Sidebar style={styles.sidebar} steps={this.steps} activestep={2} />

				<span style={styles.content}>
					<DisclosureHeader>Financial Entities</DisclosureHeader>

					<span style={styles.middle}>
						More to come here
					</span>

					<span style={styles.navigation}>
						<div onClick={this.advance}>
							nav stuff here
							<ProgressIndicator percent={this.state.percent}/>
						</div>

						<div style={{textAlign: 'left', display: 'inline-block'}}>
							<div onClick={this.goBack} style={styles.prevquestion}>

								<span style={{verticalAlign: 'middle'}}>
									Previous label here
								</span>
							</div>

						</div>
					</span>
				</span>
			</div>
		);
	}
}

Disclosure.contextTypes = {
	router: React.PropTypes.func
};
