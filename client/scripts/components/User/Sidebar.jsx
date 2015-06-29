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

  generateSteps() {
    let steps = [];
    this.props.steps.forEach((step, index) => {
      let stepState;
      if (index < this.props.activestep) {
        stepState = 'complete';
      }
      else if (index === this.props.activestep) {
        stepState = 'active';
      }
      else if (index > this.props.activestep) {
        stepState = 'incomplete';
      }

      steps.push(
        <SidebarStep label={step.label} state={stepState} key={index} />
      );
    }); 

    return steps;   
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

    let steps = this.generateSteps();
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
      container: {
        display: 'inline-flex',
        flexDirection: 'column',
        verticalAlign: 'top',
        backgroundColor: 'rgba(196, 196, 196, 0.2)'
      },
      ul: {
        marginTop: 130,
        listStyleType: 'none',
        padding: 0,
        backgroundColor: '#ffffff'
      },
      li: {
        padding: '12px 0 12px 58px',
        fontSize: 16,
        textTransform: 'uppercase',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      },
      selected: {
        fontWeight: 'bold',
        backgroundColor: '#e0e0e0',
        position: 'relative'
      },
      incomplete: {
        color: '#bbb'
      },
      arrow: {
        display: 'inline-block',
        height: 0,
        width: 0,
        border: '10px solid transparent',
        borderLeft: '18px solid #e0e0e0',
        borderBottom: '21px solid transparent',
        borderTop: '21px solid transparent',
        position: 'absolute',
        right: '-28px',
        top: 0
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let steps = this.generateSteps();
    return (
      <span style={merge(styles.container, this.props.style)}>
        <div className="fill">
          <ul style={styles.ul}>
            {steps}
          </ul>
        </div>
      </span>
    );  
  }
}

Sidebar.defaultProps = {
  steps: [],
  activestep: 0
}
