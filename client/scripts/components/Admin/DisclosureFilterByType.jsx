import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {KButton} from '../KButton';
import {AdminActions} from '../../actions/AdminActions';

export class DisclosureFilterByType extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
    this.toggleFilter = this.toggleFilter.bind(this);
    this.isChecked = this.isChecked.bind(this);
  }

  clearFilter() {
    AdminActions.clearTypeFilter();
  }

  toggleFilter(evt) {
    let index = +(evt.target.id.replace('typeFilt', ''));
    AdminActions.toggleTypeFilter(this.props.possibleTypes[index]);
  }

  isChecked(value) {
    return this.props.activeFilters.find(filter => {
      return filter === value;
    }) !== undefined;
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        whiteSpace: 'nowrap',
        color: 'black'
      },
      checkbox: {
        textAlign: 'left',
        padding: 10
      },
      clearButton: {
        backgroundColor: '#444',
        color: 'white'
      },
      hr: {
        width: '67%',
        borderBottom: '1px solid #D4D4D4'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let options = this.props.possibleTypes.map((type, index) => {
      let id = 'typeFilt' + index;
      return (
        <div style={styles.checkbox} key={type}>
          <input
            id={id}
            type="checkbox"
            checked={this.isChecked(type)}
            onChange={this.toggleFilter}
          />
          <label htmlFor={id}>{type}</label>
        </div>
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        {options}
        <KButton style={styles.clearButton} onClick={this.clearFilter}>CLEAR FILTER</KButton>
      </div>
    );
  }
}
