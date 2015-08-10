import React from 'react/addons';
import {merge} from '../../merge';
import ReactRouter from 'react-router';
let Link = ReactRouter.Link;

export default class Sidebar extends React.Component {
  render() {
    let styles = {
      container: {
        color: '#444',
        backgroundColor: '#eeeeee',
        display: 'inline-block',
        minWidth: 300,
        paddingTop: 100
      },
      firstWord: {
        fontSize: 28,
        fontWeight: 300
      },
      rest: {
        fontSize: 22,
        fontWeight: 'bold'
      },
      step: {
        padding: '20px 20px 20px 40px',
        display: 'block',
        borderRight: '1px solid #c0c0c0',
        borderBottom: '1px solid #c0c0c0',
        cursor: 'pointer'
      },
      firstStep: {
        borderTop: '1px solid #c0c0c0'
      },
      active: {
        backgroundColor: 'white',
        borderRight: '5px solid #1481A3'
      }
    };

    let steps = [
      {
        label: 'General Configuration',
        link: 'general',
        active: true
      },
      {
        label: 'Customize Questionnaire',
        link: 'questionnaire'
      },
      {
        label: 'Customize Financial Entities',
        link: 'entities'
      },
      {
        label: 'Customize Project Declarations',
        link: 'declarations'
      },
      {
        label: 'Customize Certification',
        link: 'certification'
      }
    ];

    let stepsJsx = steps.map((step, index) => {
      let parts = step.label.split(' ');
      let firstPart = parts.shift();
      let rest = parts.join(' ');

      let stepStyle = styles.step;
      if (this.props.active === step.link) {
        stepStyle = merge(stepStyle, styles.active);
      }
      else if (index === 0) {
        stepStyle = merge(stepStyle, styles.firstStep);
      }
      return (
        <Link key={index} to={step.link} style={stepStyle}>
          <div style={styles.firstWord}>{firstPart}</div>
          <div style={styles.rest}>{rest}</div>
        </Link>
      );
    });

    return (
      <span style={merge(styles.container, this.props.style)}>
        {stepsJsx}
      </span>
    );
  }
}
