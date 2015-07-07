import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import {AdminActions} from '../../../actions/AdminActions';

export class DisclosureFilterByType extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  clearFilter() {
    AdminActions.clearTypeFilter();
  }

  toggleAnnualTypeFilter() {
    AdminActions.toggleAnnualTypeFilter();
  }

  toggleProjectTypeFilter() {
    AdminActions.toggleProjectTypeFilter();
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container : {
        whiteSpace : 'nowrap',
        color : 'black',
      },
      checkbox : {
        textAlign : 'left',
        padding : 10,
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

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.checkbox}>
          <input 
            type="checkbox" 
            value="Annual"
            checked={this.props.annual}
            onClick={this.toggleAnnualTypeFilter}
          >
            <label>Annual Disclosures</label>
          </input>
        </div>
        <hr style={styles.hr} />
        <div style={merge(styles.checkbox, {marginBottom: 10})}>
          <input 
            type="checkbox" 
            value="Project"
            checked={this.props.project}
            onClick={this.toggleProjectTypeFilter}
          >
            <label>Project Disclosures</label>
          </input>
        </div>
        <KButton style={styles.clearButton} onClick={this.clearFilter}>CLEAR FILTER</KButton>
      </div>
    );
  }
}