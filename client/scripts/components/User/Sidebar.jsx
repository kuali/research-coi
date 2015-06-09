import React from 'react/addons';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {SidebarStep} from './SidebarStep';
import {CloseIcon} from '../DynamicIcons/CloseIcon';

export class Sidebar extends ResponsiveComponent {
  constructor(props) {
    super(props);

    this.state = {
      showing: true
    };

    this.commonStyles = {
    };

    this.close = this.close.bind(this);
  }

  close() {
    this.setState({
      showing: !this.state.showing
    });
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        display: 'inline-block',
        position: 'absolute',
        width: '86%',
        verticalAlign: 'top',
        backgroundColor: '#202020',
        height: '100%',
        color: 'white',
        top: 0,
        left: 0,
        transform: this.state.showing ? 'translateX(0%)' : 'translateX(-100%)',
        transition: 'transform .3s ease-out',
        zIndex: 10
      },
      closeIcon: {
        color: 'white',
        width: 30,
        height: 30,
        position: 'absolute',
        right: 10,
        top: 10
      },
      wrapper: {
        position: 'static'
      },
      ul: {
        marginTop: 130,
        listStyleType: 'none',
        padding: 0,
        backgroundColor: '#2E2E2E'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    let steps = [];
    this.props.steps.forEach((step, index) => {
      let stepState;
      if (this.props.activestep > index) {
        stepState = 'Complete';
      }
      else if (this.props.activestep === index) {
        stepState = 'Active';
      }
      else if (this.props.activestep < index) {
        stepState = 'Incomplete';
      }

      steps.push(
        <SidebarStep label={step.label} state={stepState} key={index} />
      );
    });

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={styles.wrapper}>
          <CloseIcon style={styles.closeIcon} onClick={this.close} />
          <ul style={styles.ul}>
            {steps}
          </ul>
        </div>
      </span>
    );
  }

  renderDesktop() {
    let desktopStyles = {
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <span style={merge(styles.container, this.props.style)}>sbd
      </span>
    );  
  }
}

Sidebar.defaultProps = {
  steps: [],
  activestep: 0
}
