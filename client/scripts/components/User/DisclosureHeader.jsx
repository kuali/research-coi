import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {RightArrowIcon} from '../DynamicIcons/RightArrowIcon';
import {InstructionIcon} from '../DynamicIcons/InstructionIcon';

export class DisclosureHeader extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        position: 'relative', textAlign: 'center', padding: 8
      },
      headerIcon: {
        position: 'absolute',
        height: 29,
        width: 29,
        color: '#2E2E2E',
        top: 7
      },
      stepName: {
        fontSize: 21,
        fontWeight: 300
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <header style={merge(styles.container, this.props.style)}>
        <RightArrowIcon style={merge(styles.headerIcon, {left: 10})} />
        <span style={styles.stepName}>Financial Entirireeee</span>
        <InstructionIcon style={merge(styles.headerIcon, {right: 10})} />
      </header>
    );
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>
      </span>
    );  
  }
}