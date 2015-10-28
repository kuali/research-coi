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
        color: 'black',
        fontSize: 15,
        width: 235,
        backgroundColor: 'white',
        padding: '20px 24px',
        boxShadow: '0 0 10px 2px #CCC'
      },
      button: {
        margin: '0 auto',
        display: 'block',
        marginBottom: 10,
        padding: '5px 10px',
        borderBottom: '2px solid #717171',
        width: 135,
        backgroundColor: window.colorBlindModeOn ? 'white' : '#DFDFDF'
      },
      yesButton: {
        margin: '0 auto',
        display: 'block',
        marginBottom: 10,
        padding: '5px 10px',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#00BCD4',
        color: 'white',
        borderBottom: '2px solid #717171',
        width: 135,
        fontWeight: 300,
        textShadow: '1px 1px 6px #777'
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

        <KButton onClick={this.approve} style={styles.yesButton}>YES, CONFIRM</KButton>
        <KButton onClick={this.cancel} style={styles.button}>NO, CANCEL</KButton>
      </div>
    );
  }
}
