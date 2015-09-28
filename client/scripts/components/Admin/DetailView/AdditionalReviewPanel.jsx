import React from 'react/addons';
import {merge} from '../../../merge';
import {AdminActions} from '../../../actions/AdminActions';

export default class AdditionalReviewPanel extends React.Component {
  done() {
    AdminActions.hideAdditionalReviewPanel();
  }

  render() {
    let styles = {
      container: {
        padding: '25px 30px'
      },
      done: {
        float: 'right',
        fontSize: 14,
        marginTop: 5,
        cursor: 'pointer'
      },
      download: {
        float: 'right',
        border: 0,
        backgroundColor: '#333',
        color: 'white',
        padding: '5px 10px'
      },
      dragAndDrop: {
        margin: '25px 0',
        border: '3px dashed #888',
        padding: '10px 15px',
        borderRadius: 4
      },
      complete: {
        paddingBottom: 15,
        fontSize: 14,
        verticalAlign: 'middle'
      },
      additionalReviewerLabel: {
        borderTop: '1px solid #BBB',
        paddingTop: 25
      },
      searchLabel: {
        margin: '15px 0 5px 0',
        fontSize: 12,
        color: '#666'
      },
      searchBox: {
        width: '100%',
        border: '1px solid #999',
        padding: '10px 15px'
      },
      title: {
        fontSize: 22,
        fontWeight: 300
      },
      subLabel: {
        fontSize: 14
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={{paddingBottom: 20, borderBottom: '1px solid #888'}}>
          <span style={styles.done} onClick={this.done}>Done</span>
          <span style={styles.title}>ADDITIONAL REVIEW</span>
        </div>
        <div style={{paddingTop: 12}}>
          <button style={styles.download}>Download Template</button>
          <span style={styles.subLabel}>MANAGEMENT PLAN</span>
        </div>

        <div style={styles.dragAndDrop}>
          Drag and Drop or Upload your Management Plan
        </div>

        <div style={styles.complete}>
          <input id="mpcomplete" type="checkbox" style={{marginRight: 5, verticalAlign: 'middle'}}/>
          <label htmlFor="mpcomplete">Management Plan Complete</label>
        </div>

        <div style={styles.additionalReviewerLabel}>
          <span style={styles.subLabel}>ADDITIONAL REVIEWERS</span>
        </div>

        <div style={styles.searchLabel}>
          SEARCH REVIEWERS
        </div>

        <input type="text" style={styles.searchBox} />
      </div>
    );
  }
}
