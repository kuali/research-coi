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
    AdminActions.toggleRejectionConfirmation();
  }

  cancel() {
    AdminActions.toggleRejectionConfirmation();
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        color: 'white',
        fontSize: 15,
        width: 185,
        backgroundColor: window.config.colors.three,
        padding: '20px 17px'
      },
      button: {
        margin: '0 auto',
        display: 'block',
        marginBottom: 10,
        padding: '5px 10px'
      },
      generalComments: {
        fontSize: 12,
        marginBottom: 3,
        color: '#ddd'
      },
      commentText: {
        display: 'block',
        width: '100%',
        height: 100,
        marginBottom: 30
      },
      question: {
        marginBottom: 25
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.question}>
          Are you sure you want to send this disclosure back for further review?
        </div>

        <div style={styles.generalComments}>Add general comments:</div>
        <textarea ref="comments" style={styles.commentText} />

        <KButton onClick={this.reject} style={styles.button}>YES, CONFIRM</KButton>
        <KButton onClick={this.cancel} style={styles.button}>NO, CANCEL</KButton>
      </div>
    );
  }
}
