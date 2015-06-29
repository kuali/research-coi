import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {SortArrow} from './SortArrow';

export class TableHeading extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    }
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
        padding: '15px 20px', 
        display: 'table-cell',
        borderBottom: '1px solid #aaa',
        whiteSpace: 'nowrap'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let sortArrow = <SortArrow direction={this.props.sortDirection} />;

    return (
      <span style={merge(styles.container, this.props.style)} role="columnheader" onClick={this.props.sort}>
        {this.props.children}
        {this.props.active ? sortArrow : <span></span>}
      </span>
    );
  }
}