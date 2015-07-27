import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class PageIndicator extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  renderMobile() {
    let mobileStyles = {
      container: {
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>
      </span>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        fontSize: 15
      },
      numbers: {
        marginLeft: 5,
        fontSize: 23
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>
        PAGE
        <span style={styles.numbers}>{this.props.current}/{this.props.total}</span>
      </span>
    );
  }
}
