import React from 'react/addons';
import {ResponsiveComponent} from './ResponsiveComponent';
import {merge} from '../merge';

export class KButton extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
      container: {
        backgroundColor: 'white',
        color: '#666666',
        border: '1px Solid #DEDEDE',
        borderRadius: 7,
        width: 124,
        padding: 7,
        fontSize: 13,
        outline: 0,
        cursor: 'pointer'
      }
    };
  }

  renderMobile() {
    let mobileStyles = {
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <button 
        {...this.props} 
        style={merge(styles.container, this.props.style)}
      >
        {this.props.children}
      </button>
    );
  }

  renderDesktop() {
    let desktopStyles = {
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <button 
        {...this.props} 
        style={merge(styles.container, this.props.style)}
      >
        {this.props.children}
      </button>
    );  
  }
}