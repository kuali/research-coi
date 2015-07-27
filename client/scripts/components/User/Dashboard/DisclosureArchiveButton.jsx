import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import Router from 'react-router';
let Link = Router.Link;
import {RefreshIcon} from '../../DynamicIcons/RefreshIcon';

export class DisclosureArchiveButton extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        display: 'inline-block',
        backgroundColor: '#2e2e2e',
        verticalAlign: 'top',
        padding: 5,
        cursor: 'pointer',
        color: 'white',
        fontWeight: '300',
        fontSize: 11,
        textTransform: 'uppercase',
        textAlign: 'center',
        width: '20%'
      },
      icon: {
        color: 'white',
        width: 45,
        height: 45
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <Link to="archiveview" query={{type: this.props.type}} style={merge(styles.container, this.props.style)}>
        <div>
          <RefreshIcon style={styles.icon} />
          <div>Disclosure</div>
          <div>Archive</div>
        </div>
      </Link>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: 'block',
        backgroundColor: window.config.colors.three,
        verticalAlign: 'top',
        padding: '20px 30px 20px 30px',
        cursor: 'pointer',
        color: 'white',
        fontWeight: '300'
      },
      primary: {
        fontSize: 25
      },
      secondary: {
        fontSize: 22
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <Link to="archiveview" query={{type: this.props.type}} style={merge(styles.container, this.props.style)}>
        <div>
          <div style={styles.primary}>View</div>
          <div style={styles.secondary}>Disclosure Archives</div>
        </div>
      </Link>
    );
  }
}
