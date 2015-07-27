import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';

export class DisclosureFilterByDisposition extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.state = {
      dispositions: {}
    };
  }

  clearFilter() {

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

    let dispositionCheckBoxes = Object.keys(this.state.dispositions).map((key) => {
      let disposition = this.state.dispositions[key];
      return (
        <div>
          <div style={styles.checkbox}
           key={key}
          >
            <input
              type="checkbox"
              value={key}
              onChange={this.toggleFilter}
              checked={this.filterActive(key)}
              key={key}
            >
              <label>{disposition}</label>
            </input>
          </div>
          <hr style={styles.hr} />
        </div>
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        {dispositionCheckBoxes}
        <KButton style={styles.clearButton} onClick={this.clearFilter}>CLEAR FILTER</KButton>
      </div>
    );
  }
}
