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
import {FilterBox} from '../FilterBox';

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

	hideMobileFilters() {
		AdminActions.toggleMobileFilters();
	}

	renderMobile() {
		let mobileStyles = {
			container: {
				flex: '1',
				display: 'flex',
				flexDirection: 'column',
				position: 'relative'
			},
			disclosures: {
				flex: 1,
				overflow: 'auto'
			},
			paging: {
				backgroundColor: '#202020',
				minHeight: 100
			},
			pagingButton: {
				padding: '7px 17px',
				backgroundColor: '#2E2E2E',
				color: 'white',
				border: 0,
				width: 114
			},
			buttonSymbol: {
				fontSize: 50
			},
			buttonText: {
				fontSize: 14,
				fontWeight: '300',
				padding: '5px 0',
				textAlign: 'center'
			},
			nextButton: {
				float: 'right'
			},
			filterMenu: {
				position: 'absolute',
				transform: this.state.data.applicationState.showFiltersOnMobile ? 'translateX(-0%)' : 'translateX(-100%)',
				transition: 'transform .3s ease-out',
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column'
			},
			transparent: {
				height: 34
			},
			filters: {
				flex: 1,
				backgroundColor: '#3e3e3e',
				overflow: 'auto'
			},
			filterButton: {
				backgroundColor: '#2e2e2e',
				padding: '24px 0',
				color: 'white',
				fontSize: 25,
				textAlign: 'center',
				borderBottom: '2px solid #4a4a4a'
			},
			arrow: {
				'float': 'right',
				marginRight: 25,
				fontSize: 48,
				verticalAlign: 'middle',
				marginTop: -12
			},
			label: {
				verticalAlign: 'middle'
			},
			doneButton: {
				height: 75,
				backgroundColor: 'white',
				color: '#444',
				textAlign: 'center',
				fontWeight: 300,
				fontSize: 23,
				paddingTop: 20
			}
		};
		let styles = merge(this.commonStyles, mobileStyles);

		return (
			<div style={merge(styles.container, this.props.style)}>
				<div style={styles.filterMenu}>
					<div style={styles.transparent} />
					<div style={styles.filters}>
						<div style={styles.filterButton}>
							<span style={styles.label}>DATE/DATE RANGE</span>
							<span style={styles.arrow}>&gt;</span>
						</div>
						<div style={styles.filterButton}>
							<span style={styles.label}>TYPE</span>
							<span style={styles.arrow}>&gt;</span>
						</div>
						<div style={styles.filterButton}>
							<span style={styles.label}>DISPOSITION</span>
							<span style={styles.arrow}>&gt;</span>
						</div>
						<div style={styles.filterButton}>
							<span style={styles.label}>STATUS</span>
							<span style={styles.arrow}>&gt;</span>
						</div>
						<div style={styles.filterButton}>
							<span style={styles.label}>SUBMITTED BY</span>
							<span style={styles.arrow}>&gt;</span>
						</div>
						<div style={styles.filterButton}>
							<span style={styles.label}>REPORTER NAME</span>
							<span style={styles.arrow}>&gt;</span>
						</div>
					</div>
					<div style={styles.doneButton} onClick={this.hideMobileFilters}>DONE</div>
				</div>

				<FilterBox style={styles.filterBox} count={this.state.data.disclosures.length} />

				<div style={styles.disclosures}>
					<DisclosureTable 
						sort={this.state.sort}
						sortDirection={this.state.sortDirection}
						changeSort={this.changeSort} 
						page={this.state.page} 
						style={styles.table} 
						disclosures={this.state.data.disclosures} />
				</div>

				<div style={styles.paging}>
					<button style={styles.pagingButton}>
						<div style={styles.buttonSymbol}>&lt;</div>
						<div style={styles.buttonText}>PREVIOUS</div>
					</button>
					<button style={merge(styles.pagingButton, styles.nextButton)}>
						<div style={styles.buttonSymbol}>&gt;</div>
						<div style={styles.buttonText}>NEXT</div>
					</button>
				</div>
			</div>
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
				width: 225,
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