import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';

export class SearchFilter extends ResponsiveComponent {
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
        color: 'white',
        textAlign: 'right',
        padding: 8,
        fontSize: 12,
        fontWeight: 300
      },
      arrows: {
        fontSize: 7,
        marginLeft: 4,
        verticalAlign: 'middle'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        {this.props.children}
        <span style={styles.arrows}>&#9654;</span>
      </div>
    );  
  }
}