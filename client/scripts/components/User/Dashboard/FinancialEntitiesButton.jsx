import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {RefreshIcon} from '../../DynamicIcons/RefreshIcon';

export class FinancialEntitiesButton extends ResponsiveComponent {
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
        borderRight: '1px solid white',
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
      <div style={merge(styles.container, this.props.style)}>
        <RefreshIcon style={styles.icon} />
        <div>Financial</div>
        <div>Entities</div>
      </div>
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
        fontWeight: '300',
        marginBottom: 5
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
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.primary}>Update</div>
        <div style={styles.secondary}>Financial Entities</div>
      </div>
    );
  }
}