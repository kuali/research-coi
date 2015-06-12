import React from 'react/addons';
import {ResponsiveComponent} from './ResponsiveComponent';
import {merge} from '../merge';
import {SearchIcon} from './DynamicIcons/SearchIcon';

export class SearchBox extends ResponsiveComponent {
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
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 4,
        overflow: 'hidden'
      },
      button: {
        display: 'inline-block',
        backgroundColor: window.config.colors.three,
        height: 40,
        padding: '7px 11px 0 11px',
        verticalAlign: 'middle',
        border: 0,
        width: 37
      },
      textbox: {
        display: 'inline-block',
        flex: 1,
        height: 40,
        outline: 0,
        verticalAlign: 'middle',
        fontSize: 20,
        padding: '0 6px',
        width: '82%',
        border: 0
      },
      hourglass: {
        height: 20
      },
      searchIcon: {
        width: 15,
        height: 26,
        color: 'white'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>
        <button style={styles.button}>
          <SearchIcon style={styles.searchIcon} />
        </button>
        <input ref="input" value={this.props.value} onChange={this.valueChanged} style={styles.textbox} type="text" / >
      </span>
    );  
  }
}