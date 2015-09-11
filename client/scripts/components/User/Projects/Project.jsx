import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {ProjectRelationDialog} from './ProjectRelationDialog';
import {KButton} from '../../KButton';
import {undefinedRelationExists} from '../undefinedRelationExists';

export class Project extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.toggleDialog = this.toggleDialog.bind(this);
    this.getFlagStatus = this.getFlagStatus.bind(this);
    this.getDisplayStatus = this.getDisplayStatus.bind(this);
  }

  shouldComponentUpdate() { return true; }

  toggleDialog() {
    DisclosureActions.toggleDeclaration(this.props.projectId, 'PROJECT');
  }

  getFlagStatus() {
    if (undefinedRelationExists('ENTITY', this.props.entities, this.props.relations)) {
      return 'ATTENTION';
    }
    else {
      let worstRelation = 'NONE';

      this.props.relations.forEach(element => {
        if (element.relation === 3) {
          worstRelation = 'MANAGED';
        }
        else if (worstRelation !== 'MANAGED' && element.relation === 2) {
          worstRelation = 'POTENTIAL';
        }
      });

      return worstRelation;
    }
  }

  getDisplayStatus() {
    switch (this.getFlagStatus()) {
      case 'ATTENTION': return 'ATTENTION REQUIRED';
      case 'MANAGED': return 'Managed Relationship';
      case 'POTENTIAL': return 'Potential Relationship';
      case 'NONE': return 'No Conflict';
    }
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
        width: '60%',
        verticalAlign: 'top'
      },
      item: {
        marginTop: 9,
        fontWeight: '300'
      },
      button: {
        margin: '7px 10px 7px 0',
        width: 100,
        fontSize: 12
      },
      value: {
        fontWeight: 'bold',
        marginLeft: 5
      },
      attention: {
        color: '#D3121C',
        textTransform: 'capitalize',
        marginBottom: 28
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let relationshipDialog;
    if (this.props.open) {
      relationshipDialog = (
        <ProjectRelationDialog
          relations={this.props.relations}
          entities={this.props.entities}
          style={{display: this.props.open ? 'block' : 'none'}}
          title={this.props.title}
          type={this.props.type}
          role={this.props.role}
          sponsor={this.props.sponsor}
          cosponsor={this.props.cosponsor}
          projectId={this.props.projectId}
          relationshipStatuses={this.props.relationshipStatuses}
          id={this.props.id}
          onSave={this.toggleDialog}
          onCancel={this.toggleDialog}
          onNext={this.props.onNext}
          onPrevious={this.props.onPrevious} />
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
            <span style={styles.value}>
              {this.props.title}
            </span>
          </div>
          <div>
            <span style={styles.left}>
              <div style={styles.item}>
                Project Type:
                <span style={styles.value}>
                  {this.props.type}
                </span>
              </div>
              <div style={styles.item}>
                Project Role:
                <span style={styles.value}>
                  {this.props.role}
                </span>
              </div>
              <div style={styles.item}>
                Sponsor:
                <span style={styles.value}>
                  {this.props.sponsor}
                </span>
              </div>
            </span>
            <span style={styles.right}>
              {status}

              <div>
                <KButton style={styles.button} onClick={this.toggleDialog}>Update</KButton>
                <KButton style={merge(styles.button, {marginBottom: 0})}>
                  Project Details
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
