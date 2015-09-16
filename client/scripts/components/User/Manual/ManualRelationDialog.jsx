import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {EntityRelation} from '../EntityRelation';
import {KButton} from '../../KButton';
import {ProminentButton} from '../../ProminentButton';

export class ManualRelationDialog extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.findDeclarationTypeByEntity = this.findDeclarationTypeByEntity.bind(this);
    this.findCommentByEntity = this.findCommentByEntity.bind(this);
    this.setAll = this.setAll.bind(this);
  }

  shouldComponentUpdate() { return true; }

  findDeclarationTypeByEntity(id) {
    let declaration = this.props.declarations.find((element) => {
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
    let declaration = this.props.declarations.find((element) => {
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
      'MANUAL',
      this.props.projectId,
      this.refs.setAllSelect.getDOMNode().value
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
        width: 'initial'
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
      button: {
        margin: '0 10px 0 10px',
        padding: 8,
        fontSize: 14,
        minWidth: 90
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let entityRelations = [];
    this.props.entities.forEach((element) => {
      entityRelations.push(
        <EntityRelation
          entity={element}
          relationType="MANUAL"
          projectId={this.props.projectId}
          typeCd={this.findDeclarationTypeByEntity(element.id)}
          comments={this.findCommentByEntity(element.id)}
          key={element.id}
        />
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.content}>
          <div style={styles.instructions}>
            Indicate how each Financial Entity is related to project #{this.props.projectId} - {this.props.title}:
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
            <span style={merge(styles.heading, {width: '25%'})}>Financial Entity</span>
            <span style={merge(styles.heading, {width: '30%'})}>Reporter Relationship</span>
            <span style={merge(styles.heading, {width: '45%'})}>Reporter Comments</span>
          </div>
          {entityRelations}
        </div>
        <div style={styles.buttons}>
          <div>
            <ProminentButton onClick={this.props.onSave} style={styles.button}>Done</ProminentButton>
          </div>
        </div>
      </div>
    );
  }
}
