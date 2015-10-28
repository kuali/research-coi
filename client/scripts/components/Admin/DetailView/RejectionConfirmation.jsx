import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import {AdminActions} from '../../../actions/AdminActions';

export class RejectionConfirmation extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};
  }

  reject() {
    AdminActions.rejectDisclosure();
  }

  cancel() {
    AdminActions.toggleRejectionConfirmation();
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
      generalComments: {
        fontSize: 12,
        marginBottom: 3
      },
      commentText: {
        display: 'block',
        width: '100%',
        height: 200,
        marginBottom: 30,
        resize: 'none',
        borderRadius: 5,
        border: '1px solid #AAA',
        padding: 7,
        fontSize: 14
      },
      question: {
        paddingBottom: 17,
        borderBottom: '1px solid #AAA',
        marginBottom: 17
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);
    let rejectionSection;
    if (this.props.canReject) {
      rejectionSection = (
        <div style={merge(styles.container, this.props.style)} >
          <div style={styles.question}>
            Are you sure you want to send this disclosure back for further review?
          </div>

          <div style={styles.generalComments}>NOTIFICATION TO USER</div>
          <textarea ref="comments" style={styles.commentText} />

          <KButton onClick={this.reject} style={styles.yesButton}>YES, SUBMIT</KButton>
          <KButton onClick={this.cancel} style={styles.button}>NO, CANCEL</KButton>
        </div>
      );
    } else {
      rejectionSection = (
        <div style={merge(styles.container, this.props.style)} >
          <div style={styles.question}>
            Please add one or more comments visible to the PI before sending back a disclosure.
          </div>

          <KButton onClick={this.cancel} style={styles.button}>CLOSE</KButton>
        </div>
      );
    }
    return (
      <div>
        {rejectionSection}
      </div>
    );
  }
}
