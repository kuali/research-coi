import React from 'react/addons';
import {merge} from '../../../merge';
import {DeleteIcon} from '../../DynamicIcons/DeleteIcon';
import {NextIcon} from '../../DynamicIcons/NextIcon';
import {KButton} from '../../KButton';

export default class SidePanel extends React.Component {
  render() {
    let submitEnabled = this.props.submitEnabled;

    let styles = {
      container: {
        width: 220
      },
      message: {
        margin: '25px 28px 25px 3px',
        paddingBottom: 18,
        borderBottom: '1px solid #AAA'
      },
      submit: {
        color: submitEnabled ? '#333' : '#CCC',
        cursor: submitEnabled ? 'pointer' : 'default',
        verticalAlign: 'middle',
        fontSize: 18
      },
      cancel: {
        cursor: 'pointer',
        verticalAlign: 'middle',
        fontSize: 18
      },
      submitIcon: {
        color: submitEnabled ? '#333' : '#CCC',
        width: 30,
        height: 36,
        verticalAlign: 'middle',
        margin: '0 10px 5px 15px'
      },
      cancelIcon: {
        color: '#333',
        width: 30,
        height: 36,
        verticalAlign: 'middle',
        margin: '0 10px 0 15px'
      },
      certificationPane: {
        backgroundColor: '#444',
        color: 'white',
        padding: '25px 15px'
      },
      certCheckbox: {
        paddingTop: 17,
        textAlign: 'center',
        fontSize: 19
      },
      agreedLabel: {
        paddingLeft: 5
      },
      confirmButton: {
        fontSize: 20,
        color: 'black'
      },
      confirmSection: {
        textAlign: 'center',
        paddingTop: 35
      }
    };

    let content;
    if (this.props.showingCertification) {
      content = (
        <div style={styles.certificationPane}>
          <div>{this.props.certificationText}</div>
          <div style={styles.certCheckbox}>
            <input type="checkbox" id="certCheck" />
            <label style={styles.agreedLabel} htmlFor="certCheck">Agreed</label>
          </div>
          <div style={styles.confirmSection}>
            <KButton style={styles.confirmButton}>Confirm</KButton>
          </div>
        </div>
      );
    }
    else {
      let message;
      if (submitEnabled) {
        message = 'Yeah, you did it! Now just submit and go get out of here you crazy kid!';
      }
      else {
        message = 'Please either revise or respond to each section before resubmitting.';
      }
      content = (
        <div>
          <div style={styles.message}>{message}</div>
          <div style={styles.submit}>
            <NextIcon style={styles.submitIcon} />
            SUBMIT
          </div>
          <div style={styles.cancel}>
            <DeleteIcon style={styles.cancelIcon} />
            CANCEL
          </div>
        </div>
      );
    }
    return (
      <span style={merge(styles.container, this.props.style)}>
        {content}
      </span>
    );
  }
}
