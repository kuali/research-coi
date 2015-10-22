import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../merge';
import {SidebarStep} from './SidebarStep';

export class Sidebar extends React.Component {
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

      let extraStyle;
      if (index === 0) {
        extraStyle = {
          borderTop: '1px solid #c0c0c0'
        };
      }
      steps.push(
        <SidebarStep
          label={step.label}
          state={stepState}
          key={index}
          step={step.value}
          style={extraStyle}
        />
      );
    });

    return steps;
  }

  render() {
    let styles = {
      container: {
        display: 'inline-flex',
        flexDirection: 'column',
        verticalAlign: 'top',
        backgroundColor: '#eeeeee'
      },
      ul: {
        marginTop: 130,
        listStyleType: 'none',
        padding: 0,
        backgroundColor: '#eeeeee'
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
        backgroundColor: 'white',
        position: 'relative',
        borderRight: '5px solid #1481A3'
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
};
