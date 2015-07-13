import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {ProjectRelation} from './ProjectRelation';
import {KButton} from '../../KButton';
import {ProminentButton} from '../../ProminentButton';

export class EntityRelationDialog extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.onNext = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.findRelationByProject = this.findRelationByProject.bind(this);
    this.findCommentByProject = this.findCommentByProject.bind(this);
    this.setAll = this.setAll.bind(this);
  }

  shouldComponentUpdate() {return true;}

  onNext() {
    this.props.onNext(this.props.id, 'ENTITY');
  }

  onPrevious() {
    this.props.onPrevious(this.props.id, 'ENTITY');
  }

  findRelationByProject(id) {
    let relation = this.props.relations.find((element) => {
     return element.projectId === id;
    });

    if (relation) {
     return relation.relation;
    }
    else {
     return null;
    }
  }

  findCommentByProject(id) {
    let relation = this.props.relations.find((element) => {
     return element.projectId === id;
    });

    if (relation) {
     return relation.comment;
    }
    else {
     return null;
    }
  }

  setAll() {
    DisclosureActions.setAllForEntity(this.props.entityId, this.refs.setAllSelect.getDOMNode().value);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        backgroundColor: '#c1c1c1'
      },
      content: {
        padding: '25px 25px 15px 25px',
        position: 'relative',
        backgroundColor: 'white'
      },
      instructions: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 15
      },
      setAllButton: {
        width: 'initial',
        margin: '7px 10px 7px 0'
      },
      heading: {
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 'bold'
      },
      headings: {
        marginTop: 25,
        paddingBottom: 10
      },
      buttons: {
        backgroundColor: 'white',
        padding: 15,
        textAlign: 'right',
        borderTop: '1px solid #C3C3C3'
      },
      spacer: {
        display: 'inline-block',
        width: 10,
        borderRight: '1px solid #666',
        height: 32,
        verticalAlign: 'middle'
      },
      button: {
        margin: '0 10px 0 10px',
        padding: 8,
        minWidth: 90,
        width: 'initial'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let projectRelations = [];
    this.props.projects.forEach((element) => {
      projectRelations.push(
        <ProjectRelation 
          project={element}
          entityId={this.props.entityId}
          relation={this.findRelationByProject(element.projectid)}
          comments={this.findCommentByProject(element.projectid)}
          key={element.projectid}
        />
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.content}>
          <div style={styles.instructions}>
            Indicate how each project is related to this financial entity - {this.props.title}:
          </div>
          <div>
            <KButton onClick={this.setAll} style={styles.setAllButton}>Set All:</KButton>
            to: 
            <select ref="setAllSelect" defaultValue={'NONE'} style={{marginLeft: 10}}>
              <option value="NONE">No Conflict</option>
              <option value="POTENTIAL">Potential Relationship</option>
              <option value="MANAGED">Managed Relationship</option>
            </select>
          </div>
          <div style={styles.headings}>
            <span style={merge(styles.heading, {width: '25%'})}>Project</span>
            <span style={merge(styles.heading, {width: '30%'})}>Reporter Relationship</span>
            <span style={merge(styles.heading, {width: '45%'})}>Reporter Comments</span>
          </div>
          {projectRelations}
        </div>
        <div style={styles.buttons}>
          <div>
            <ProminentButton onClick={this.onPrevious} style={styles.button}>Previous Project ^</ProminentButton>
            <ProminentButton onClick={this.onNext} style={styles.button}>Next Project v</ProminentButton>
            <span style={styles.spacer} />
            <ProminentButton onClick={this.props.onCancel} style={styles.button}>Cancel</ProminentButton>
            <ProminentButton onClick={this.props.onSave} style={styles.button}>Done</ProminentButton>
          </div>
        </div>
      </div>
    );
  }
}