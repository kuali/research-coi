import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class ConfirmationMessage extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
      close: {
        cursor: 'pointer',
        position: 'absolute',
        right: 8,
        top: 8,
        display: 'inline-block',
        fontWeight: 'normal',
        fontSize: 18
      },
      x: {
        fontWeight: 'bold',
        marginLeft: 6,
        marginRight: 12
      }
    };

    this.close = this.close.bind(this);
  }

  close() {
    DisclosureActions.toggleConfirmationMessage();
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        textAlign: 'center',
        fontSize: 22,
        position: 'relative',
        padding: '12px 8px',
        margin: 0
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.close} onClick={this.close}>
          CLOSE
          <span style={styles.x}>X</span>
        </span>
        <div>Awesome, you have successfully submitted your disclosure!</div>
        <div>Now go kick back and relax or click below to review.</div>
      </div>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        textAlign: 'center',
        fontSize: 22,
        position: 'relative',
        padding: '12px 8px',
        margin: '42px 49px 36px 49px',
        borderRadius: 5
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.close} onClick={this.close}>
          CLOSE
          <span style={styles.x}>X</span>
        </span>
        <div>Awesome, you have successfully submitted your disclosure!</div>
        <div>Now go kick back and relax or click below to review.</div>
      </div>
    );
  }
}
