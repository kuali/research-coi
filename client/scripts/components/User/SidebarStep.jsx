import React from 'react/addons';
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
    }

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
        backgroundColor: '#262626',
        position: 'relative'
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
        break;
      case 'active':
        return (
          <div onClick={this.navigate}>
            <li style={merge(styles.container, styles.selected)}>
              <CurrentStepIcon style={styles.image} />
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
        break;
      case 'incomplete':
        return (
          <li style={merge(styles.container, styles.incomplete)}>
            <FutureStepIcon style={styles.image} />
            <span style={styles.stepName}>{this.props.label}</span>
          </li>
        );
        break;
    }
  }

  renderDesktop() {
    let desktopStyles = {
      container: {
        padding: '3px 0 3px 7px',
        fontSize: 16,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      },
      arrow: {
        display: 'inline-block',
        height: 0,
        width: 0,
        border: '10px solid transparent',
        borderLeft: '18px solid #ececec',
        borderBottom: '26px solid transparent',
        borderTop: '26px solid transparent',
        position: 'absolute',
        right: '-27px',
        top: 0,
        zIndex: '99'
      },
      selected: {
        fontWeight: 'bold',
        backgroundColor: '#ECECEC',
        position: 'relative',
        color: 'black',
        boxShadow: '0 0 8px #CDCDCD'
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
          <div style={styles.clickable} onClick={this.navigate}>
            <li style={styles.container}>
              <CompletedStepIcon style={styles.image} />
              <span style={styles.stepName}>{this.props.label}</span>
            </li>
          </div>
        );
        break;
      case 'active':
        return (
          <div style={styles.clickable} onClick={this.navigate}>
            <li style={merge(styles.container, styles.selected)}>
              <CurrentStepIcon style={styles.image} />
              <span style={styles.stepName}>{this.props.label}</span>
              <div style={styles.arrow}></div>
            </li>
          </div>
        );
        break;
      case 'incomplete':
        return (
          <li style={merge(styles.container, styles.incomplete)}>
            {<FutureStepIcon style={styles.image} />}
            <span style={styles.stepName}>{this.props.label}</span>
          </li>
        );
        break;
    }
  }
}

SidebarStep.defaultProps = {
  state: ''
}