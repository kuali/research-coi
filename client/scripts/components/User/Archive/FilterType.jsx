import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class FilterType extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };

    this.activateThisFilter = this.activateThisFilter.bind(this);
  }

  activateThisFilter() {
    DisclosureActions.changeArchiveFilter(this.props.type);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        textAlign: 'right',
        padding: '0 15px',
        margin: '30px 0',
        lineHeight: '15px',
        cursor: 'pointer',
        color: this.props.active ? 'white' : '#CCC',
        fontWeight: this.props.active ? 'bold' : 'normal',
        borderRight: this.props.active ? '7px solid #535353' : '7px solid transparent'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)} onClick={this.activateThisFilter}>
        {this.props.children}
      </div>
    );
  }
}
