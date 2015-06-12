import React from 'react/addons';
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {AdminStore} from '../../../stores/AdminStore';
import {AdminActions} from '../../../actions/AdminActions';
import {SearchFilterGroup} from '../SearchFilterGroup';
import {SearchBox} from '../../SearchBox';
import {PageIndicator} from './PageIndicator'
import {KButton} from '../../KButton';
import {DisclosureTable} from './DisclosureTable';

export class ListView extends ResponsiveComponent {
	constructor() {
		super();
		this.commonStyles = {
		};

		this.state = {
			data: AdminStore.getState(),
			page: 1
		}

		this.changeSort = this.changeSort.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		AdminStore.listen(this.onChange);
	}

	componentWillUnmount() {
		AdminStore.unlisten(this.onChange);
	}

	onChange() {
		this.setState({
			data: AdminStore.getState()
		});
	}

	changeSort(newSort, newDirection) {
		AdminActions.changeSort(newSort, newDirection);
	}

	changeType(newType) {
		this.setState({
			page: 1
		});

		AdminActions.changeTypeFilter(newType);
	}

	updateQuery(newQuery) {
		this.setState({
			page: 1
		});

		AdminActions.changeQuery(newQuery);
	}

	advancePages() {
		this.setState({
			page: this.state.page + 1
		});
	}

	goBackPage() {
		if (this.state.page > 1) {
			this.setState({
				page: this.state.page - 1
			});
		}
	}

	renderMobile() {
		let mobileStyles = {
		};
		let styles = merge(this.commonStyles, mobileStyles);

		return (
			<span style={merge(styles.container, this.props.style)}>
				List View
			</span>
		);
	}

	renderDesktop() {
		let desktopStyles = {
			container: {
				flex: '1',
				display: 'flex',
				flexDirection: 'row'
			},
			sidebar: {
				width: 275,
				backgroundColor: '#202020'
			},
			content: {
				flex: '1',
				display: 'inline-block',
				padding: '15px 30px',
				borderTop: '6px solid ' + window.config.colors.three,
				backgroundColor: '#E8E9E6'
			},
			searchbox: {
				width: 300
			},
			pageButton: {
				height: 40,
				marginLeft: 10,
				width: 'initial',
				color: 'white'
			},
			previousPage: {
				padding: '7px 20px 7px 16px',
				backgroundColor: window.config.colors.three
			},
			nextPage: {
				padding: '7px 20px',
				backgroundColor: window.config.colors.two
			},
			table: {
				marginTop: 21,
				backgroundColor: 'white',
				borderRadius: 15,
				overflow: 'hidden',
				boxShadow: '0 0 9px #bbb'
			},
			filterGroup: {
				marginTop: 90
			},
			pageButtons: {
				whiteSpace: 'nowrap',
				'float': 'right'
			}
		};
		let styles = merge(this.commonStyles, desktopStyles);

		return (
			<div style={merge(styles.container, this.props.style)}>
				<span style={styles.sidebar}>
					<SearchFilterGroup style={styles.filterGroup} />
				</span>
				<span style={styles.content}>
					<div>
						<span style={styles.pageButtons}>
							<PageIndicator 
								current={this.state.page} 
								total={this.state.disclosures ? Math.ceil(this.state.disclosures.length / 10) : 0} 
							/>

							<KButton style={merge(styles.pageButton, styles.previousPage)} onClick={this.goBackPage}>&lt; PREVIOUS PAGE</KButton>
							<KButton style={merge(styles.pageButton, styles.nextPage)} onClick={this.advancePages}>NEXT PAGE &gt;</KButton>
						</span>
						<SearchBox style={styles.searchbox} value={this.state.query} onChange={this.updateQuery} />
					</div>

					<div>
						<DisclosureTable 
							type={this.state.type}
							sort={this.state.sort}
							sortDirection={this.state.sortDirection}
							changeSort={this.changeSort} 
							page={this.state.page} 
							style={styles.table} 
							disclosures={this.state.data.disclosures} />
					</div>
				</span>
			</div>
		);
	}
}