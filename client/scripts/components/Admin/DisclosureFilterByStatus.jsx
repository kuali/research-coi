import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {KButton} from '../KButton';
import {AdminActions} from '../../actions/AdminActions';

export class DisclosureFilterByStatus extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  clearFilter() {
    AdminActions.clearStatusFilter();
  }

  toggleInProgressStatusFilter() {
    AdminActions.toggleInProgressStatusFilter();
  }

  toggleAwaitingReviewStatusFilter() {
    AdminActions.toggleAwaitingReviewStatusFilter();
  }

  toggleRevisionNecessaryStatusFilter() {
    AdminActions.toggleRevisionNecessaryStatusFilter();
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

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.checkbox}>
          <input type="checkbox"
            value="In Progress"
            checked={this.props.inProgress}
            onChange={this.toggleInProgressStatusFilter}
          >
            <label>In Progress</label>
          </input>
        </div>
        <hr style={styles.hr} />
        <div style={styles.checkbox}>
          <input type="checkbox"
            value="Awaiting Review"
            checked={this.props.awaitingReview}
            onChange={this.toggleAwaitingReviewStatusFilter}
          >
            <label>Awaiting Review</label>
          </input>
        </div>
        <hr style={styles.hr} />
        <div style={merge(styles.checkbox, {marginBottom: 10})}>
          <input type="checkbox"
            value="Revision Necessary"
            checked={this.props.revisionNecessary}
            onChange={this.toggleRevisionNecessaryStatusFilter}
          >
            <label>Revision Necessary</label>
          </input>
        </div>
        <KButton style={styles.clearButton} onClick={this.clearFilter}>CLEAR FILTER</KButton>
      </div>
    );
  }
}
