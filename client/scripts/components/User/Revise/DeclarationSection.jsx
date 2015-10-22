import React from 'react/addons';
import {merge} from '../../../merge';
import ProjectToReview from './ProjectToReview';

export default class DeclarationSection extends React.Component {
  render() {
    let styles = {
      container: {
        margin: '25px 20px 25px 35px',
        backgroundColor: 'white',
        borderRadius: 5,
        boxShadow: '0 0 10px 2px #DDD',
        overflow: 'hidden'
      },
      title: {
        fontSize: 23,
        padding: '10px 18px',
        borderBottom: '1px solid #DDD',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        color: 'white'
      },
      body: {
        padding: 23
      }
    };

    let projects = this.props.declarationsToReview;

    let projectsJSX = projects.map((project, index) => {
      return (
        <ProjectToReview
          key={project.id}
          project={project}
          last={index === projects.length - 1}
        />
      );
    });

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>
          PROJECT DECLARATIONS
        </div>
        <div className="fill" style={styles.body}>
          {projectsJSX}
        </div>
      </div>
    );
  }
}
