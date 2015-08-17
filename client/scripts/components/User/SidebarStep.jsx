import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {FutureStepIcon} from '../DynamicIcons/FutureStepIcon';
import {CurrentStepIcon} from '../DynamicIcons/CurrentStepIcon';
import {CompletedStepIcon} from '../DynamicIcons/CompletedStepIcon';
import {DisclosureActions} from '../../actions/DisclosureActions';

export class SidebarStep extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
      incomplete: {
        color: '#C1C1C1'
      },
      stepName: {
        verticalAlign: 'middle',
        paddingLeft: 5
      }
    };

    this.navigate = this.navigate.bind(this);
  }

  navigate() {
    DisclosureActions.jumpToStep(this.props.step);
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        padding: '3px 0 3px 7px',
        fontSize: 18,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      },
      selected: {
        fontWeight: 'bold',
        backgroundColor: 'white',
        position: 'relative',
        borderRight: '5px solid #1481A3'
      },
      image: {
        width: 42,
        height: 42,
        verticalAlign: 'middle',
        color: '#c1c1c1'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    switch (this.props.state.toLowerCase()) {
      case 'complete':
        return (
          <div onClick={this.navigate}>
            <li style={styles.container}>
              <CompletedStepIcon style={styles.image} />
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
      case 'active':
        return (
          <div onClick={this.navigate}>
            <li style={merge(styles.container, styles.selected)}>
              <CurrentStepIcon style={styles.image} />
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
      case 'incomplete':
        return (
          <li style={merge(styles.container, styles.incomplete)}>
            <FutureStepIcon style={styles.image} />
            <span style={styles.stepName}>{this.props.label}</span>
          </li>
        );
    }
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        padding: '20px 20px 20px 40px',
        fontSize: 22,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #c0c0c0'
      },
      selected: {
        fontWeight: 'bold',
        backgroundColor: 'white',
        position: 'relative',
        color: 'black',
        boxShadow: '0 0 8px #CDCDCD',
        borderRight: '5px solid #1481A3'
      },
      clickable: {
        cursor: 'pointer'
      },
      image: {
        width: 42,
        height: 42,
        verticalAlign: 'middle',
        color: window.config.colors.one
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    switch (this.props.state.toLowerCase()) {
      case 'complete':
        return (
          <div style={merge(styles.clickable, this.props.style)} onClick={this.navigate}>
            <li style={styles.container}>
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
      case 'active':
        return (
          <div style={merge(styles.clickable, this.props.style)} onClick={this.navigate}>
            <li style={merge(styles.container, styles.selected)}>
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
      case 'incomplete':
        return (
          <li style={merge(styles.container, styles.incomplete, this.props.style)}>
            <span style={styles.stepName}>{this.props.label}</span>
          </li>
        );
    }
  }
}

SidebarStep.defaultProps = {
  state: ''
};
