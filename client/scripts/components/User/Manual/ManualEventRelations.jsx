import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {ManualRelationDialog} from './ManualRelationDialog';
import {KButton} from '../../KButton';
import {undefinedRelationExists} from '../undefinedRelationExists';

export class ManualEventRelations extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.toggleDialog = this.toggleDialog.bind(this);
    this.getFlagStatus = this.getFlagStatus.bind(this);
    this.getDisplayStatus = this.getDisplayStatus.bind(this);
    this.editProject = this.editProject.bind(this);
  }

  shouldComponentUpdate() { return true; }

  toggleDialog() {
    DisclosureActions.toggleDeclaration(this.props.disclosure.id, 'MANUAL');
  }

  getFlagStatus() {
    if (undefinedRelationExists('ENTITY', this.props.entities, this.props.relations)) {
      return 'ATTENTION';
    }
    else {
      let worstRelation = 'NONE';

      if (this.props.relations) {
        this.props.relations.forEach(element => {
          if (element.relation === 'MANAGED') {
            worstRelation = 'MANAGED';
          }
          else if (worstRelation !== 'MANAGED' && element.relation === 'POTENTIAL') {
            worstRelation = 'POTENTIAL';
          }
        });
      }

      return worstRelation;
    }
  }

  getDisplayStatus() {
    switch (this.getFlagStatus()) {
      case 'ATTENTION': return 'Action Required';
      case 'MANAGED': return 'Managed Relationship';
      case 'POTENTIAL': return 'Potential Relationship';
      case 'NONE': return 'No Conflict';
    }
  }

  editProject() {
    DisclosureActions.editManualEvent(this.props.disclosure.id);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: 'block',
        overflow: 'hidden',
        marginBottom: 25,
        boxShadow: '0 0 15px #E6E6E6',
        borderRadius: 5,
        backgroundColor: 'white'
      },
      content: {
        padding: 16,
        fontSize: 22,
        zIndex: 10,
        position: 'relative',
        boxShadow: '0 0 10px #ddd'
      },
      title: {
        fontSize: 23,
        marginBottom: 5
      },
      right: {
        display: 'inline-block',
        margin: '0 0 0 17px',
        verticalAlign: 'top',
        fontSize: 18,
        paddingTop: 9
      },
      left: {
        display: 'inline-block',
        fontSize: 18,
        marginLeft: 25,
        width: '50%',
        verticalAlign: 'top'
      },
      item: {
        marginTop: 9
      },
      button: {
        margin: '7px 10px 7px 0',
        fontSize: 11
      },
      value: {
        fontWeight: 'bold',
        marginLeft: 5
      },
      attention: {
        color: 'red',
        textTransform: 'capitalize',
        marginBottom: 28
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let relationshipDialog;
    if (this.props.open) {
      relationshipDialog = (
        <ManualRelationDialog
          relations={this.props.relations}
          entities={this.props.entities}
          title={this.props.disclosure.title}
          projectId={this.props.disclosure.projectId}
          onSave={this.toggleDialog}
          onCancel={this.toggleDialog}
        />
      );
    }

    let status;
    if (this.getFlagStatus() === 'ATTENTION') {
      status = (
        <div style={styles.attention}>
          - {this.getDisplayStatus()} -
        </div>
      );
    }
    else {
      status = (
        <div style={{marginBottom: 6}}>
          <div style={{fontWeight: '300'}}>Relationship Status:</div>
          <div style={{fontWeight: '700'}}>{this.getDisplayStatus()}</div>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.content}>
          <div style={styles.title}>
            Project Title:
            <span style={styles.value}>
              {this.props.disclosure.title}
            </span>
          </div>
          <div>
            <span style={styles.left}>
              <div style={styles.item}>
                Project Type:
                <span style={styles.value}>
                  {this.props.disclosure.projectType}
                </span>
              </div>
              <div style={styles.item}>
                Project Role:
                <span style={styles.value}>
                  {this.props.disclosure.role}
                </span>
              </div>
              <div style={styles.item}>
                Sponsor:
                <span style={styles.value}>
                  {this.props.disclosure.sponsor}
                </span>
              </div>
            </span>
            <span style={styles.right}>
              {status}

              <div>
                <KButton style={styles.button} onClick={this.toggleDialog}>Edit Declarations</KButton>
                <KButton style={merge(styles.button, {marginBottom: 0})} onClick={this.editProject}>
                  Edit Project Details
                </KButton>
              </div>
            </span>
          </div>
        </div>

        {relationshipDialog}
      </div>
    );
  }
}

ManualEventRelations.defaultProps = {
  relations: [],
  entities: []
};
