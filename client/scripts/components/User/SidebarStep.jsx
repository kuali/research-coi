import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../merge';
import {FutureStepIcon} from '../DynamicIcons/FutureStepIcon';
import {CurrentStepIcon} from '../DynamicIcons/CurrentStepIcon';
import {CompletedStepIcon} from '../DynamicIcons/CompletedStepIcon';
import {DisclosureActions} from '../../actions/DisclosureActions';

export class SidebarStep extends React.Component {
  constructor() {
    super();

    this.navigate = this.navigate.bind(this);
  }

  navigate() {
    DisclosureActions.jumpToStep(this.props.step);
  }

  render() {
    let styles = {
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
        borderRight: window.colorBlindModeOn ? '5px solid black' : '5px solid #0095A0'
      },
      clickable: {
        cursor: 'pointer'
      },
      image: {
        width: 42,
        height: 42,
        verticalAlign: 'middle',
        color: window.config.colors.one
      },
      incomplete: {
        color: '#C1C1C1'
      },
      stepName: {
        verticalAlign: 'middle',
        paddingLeft: 5
      }
    };

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
