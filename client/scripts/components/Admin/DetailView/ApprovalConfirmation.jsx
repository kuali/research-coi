import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import {AdminActions} from '../../../actions/AdminActions';

export class ApprovalConfirmation extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  approve() {
    AdminActions.approveDisclosure();
  }

  cancel() {
    AdminActions.toggleApprovalConfirmation();
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        color: 'white',
        fontSize: 15,
        width: 210,
        backgroundColor: '#1481A3',
        padding: '20px 17px'
      },
      button: {
        margin: '0 auto',
        display: 'block',
        marginBottom: 10,
        padding: '5px 10px'
      },
      question: {
        marginBottom: 30
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.question}>
          Are you sure you want to approve this disclosure?
        </div>

        <KButton onClick={this.approve} style={styles.button}>YES, CONFIRM</KButton>
        <KButton onClick={this.cancel} style={styles.button}>NO, CANCEL</KButton>
      </div>
    );
  }
}
