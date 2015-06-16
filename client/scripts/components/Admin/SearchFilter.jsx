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
        backgroundColor: '#2e2e2e',
        padding: '24px 0',
        color: 'white',
        fontSize: 25,
        textAlign: 'center',
        borderBottom: '2px solid #4a4a4a'
      },
      arrow: {
        'float': 'right',
        marginRight: 25,
        fontSize: 48,
        verticalAlign: 'middle',
        marginTop: -12
      },
      label: {
        verticalAlign: 'middle'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.label}>{this.props.children}</span>
        <span style={styles.arrow}>&gt;</span>
      </div>
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