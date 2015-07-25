import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {getStatusText} from '../../../statusText';
import {formatDate} from '../../../formatDate';
import {AdminActions} from '../../../actions/AdminActions';

export class DisclosureListItem extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.selectDisclosure = this.selectDisclosure.bind(this);
  }

  selectDisclosure() {
    AdminActions.loadDisclosure(this.props.disclosure.id);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        borderBottom: '1px solid #6d6d6d',
        padding: 6,
        paddingLeft: 40,
        fontSize: '.9em',
        backgroundColor: this.props.selected ? '#c1c1c1' : 'transparent',
        cursor: 'pointer'
      },
      disclosureType: {
        fontWeight: 'bold'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let disclosure = this.props.disclosure;
    let dateToShow;
    if (disclosure.revisedOn) {
      dateToShow = (
        <div>Revised: {formatDate(disclosure.revisedOn)}</div>
      );
    }
    else {
      dateToShow = (
        <div>Submitted for Approval: {formatDate(disclosure.submittedOn)}</div>
      );
    }

    return (
      <li style={merge(styles.container, this.props.style)} onClick={this.selectDisclosure}>
        <div style={styles.disclosureType}>
          {disclosure.type === 'ANNUAL' ? 'Annual' : 'Project'} Disclosure
        </div>
        <div>Reporter: {disclosure.submittedBy}</div>
        {dateToShow}
        <div>Status: {getStatusText(disclosure.status)}</div>
      </li>
    );
  }
}
