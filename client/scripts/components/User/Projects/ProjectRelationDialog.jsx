import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {EntityRelation} from '../EntityRelation';
import {KButton} from '../../KButton';
import {ProminentButton} from '../../ProminentButton';

export class ProjectRelationDialog extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.onNext = this.onNext.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.findDeclarationTypeByEntity = this.findDeclarationTypeByEntity.bind(this);
    this.findCommentByEntity = this.findCommentByEntity.bind(this);
    this.setAll = this.setAll.bind(this);
  }

  shouldComponentUpdate() { return true; }

  onNext() {
    this.props.onNext(this.props.id, 'PROJECT');
  }

  onPrevious() {
    this.props.onPrevious(this.props.id, 'PROJECT');
  }

  findDeclarationTypeByEntity(id) {
    let declaration = this.props.declarations.find(element => {
      return element.finEntityId === id;
    });

    if (declaration) {
      return declaration.typeCd;
    }
    else {
      return null;
    }
  }

  findCommentByEntity(id) {
    let declaration = this.props.declarations.find(element => {
      return element.finEntityId === id;
    });

    if (declaration) {
      return declaration.comments;
    }
    else {
      return null;
    }
  }

  setAll() {
    DisclosureActions.setAllForProject(
      'PROJECT',
      this.props.projectId,
      parseInt(this.refs.setAllSelect.getDOMNode().value)
    );
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
        margin: '7px 10px 7px 0',
        width: 'initial',
        padding: 8
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

    let entityRelations = [];
    this.props.entities.forEach((element) => {
      entityRelations.push(
        <EntityRelation
          entity={element}
          relationType="PROJECT"
          projectId={this.props.projectId}
          typeCd={this.findDeclarationTypeByEntity(element.id)}
          comments={this.findCommentByEntity(element.id)}
          declarationTypes={this.props.declarationTypes}
          key={element.id}
        />
      );
    });

    let declarationTypeOptions = this.props.declarationTypes.map(option =>{
      return (
        <option key={option.typeCd} value={option.typeCd}>{option.description}</option>
      );
    });

    let navButtons = [];
    if (this.props.projectCount > 0) {
      if (this.props.id > 0) {
        navButtons.push(
        <ProminentButton key='previous' onClick={this.onPrevious} style={styles.button}>Previous Project ^</ProminentButton>
        );
      }
      if (this.props.id < this.props.projectCount - 1) {
        navButtons.push(
        <ProminentButton key='next' onClick={this.onNext} style={styles.button}>Next Project v</ProminentButton>
        );
      }
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.content}>
          <div style={styles.instructions}>
            Indicate how each Financial Entity is related to project #{this.props.projectId} - {this.props.title}:
          </div>
          <div>
            <KButton onClick={this.setAll} style={styles.setAllButton}>Set All:</KButton>
            to:
            <select ref="setAllSelect" style={{marginLeft: 10}}>
              {declarationTypeOptions}
            </select>
          </div>
          <div style={styles.headings}>
            <span style={merge(styles.heading, {width: '25%'})}>Financial Entity</span>
            <span style={merge(styles.heading, {width: '30%'})}>Reporter Relationship</span>
            <span style={merge(styles.heading, {width: '45%'})}>Reporter Comments</span>
          </div>
          {entityRelations}
        </div>
        <div style={styles.buttons}>
          <div>
            {navButtons}
            <span style={styles.spacer} />
            <ProminentButton onClick={this.props.onSave} style={styles.button}>Done</ProminentButton>
          </div>
        </div>
      </div>
    );
  }
}
