import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {KButton} from '../KButton';

export class DisclosureFilterByUnit extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
    this.state = {};
  }

  clearFilter() {

  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        whiteSpace: 'nowrap',
        color: 'black',
        textAlign: 'left'
      },
      clearButton: {
        backgroundColor: '#444',
        color: 'white',
        'float': 'right'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <label htmlFor="units" style={{display: 'block', fontSize: 13}}>Department</label>
        <select
          id="units"
          multiple="true"
          size="5"
          style={{display: 'block', fontSize: 15, marginBottom: 19}}
        >
        </select>
        <KButton style={styles.clearButton} onClick={this.clearFilter}>CLEAR FILTER</KButton>
      </div>
    );
  }
}
