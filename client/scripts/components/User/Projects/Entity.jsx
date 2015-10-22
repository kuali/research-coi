import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {EntityRelationDialog} from './EntityRelationDialog';
import {KButton} from '../../KButton';
import {undefinedRelationExists} from '../undefinedRelationExists';
import ConfigStore from '../../../stores/ConfigStore';

export class Entity extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.toggleDialog = this.toggleDialog.bind(this);
    this.getDisplayStatus = this.getDisplayStatus.bind(this);
    this.getDeclarationDescription = this.getDeclarationDescription.bind(this);
  }

  shouldComponentUpdate() { return true; }

  toggleDialog() {
    DisclosureActions.toggleDeclaration(this.props.entity.id, 'ENTITY');
  }

  getDisplayStatus() {
    if (undefinedRelationExists('PROJECT', this.props.projects, this.props.declarations)) {
      return 'Action Required';
    }
    else {
      let worstDeclaration = 1;

      this.props.declarations.forEach(element => {
        if (worstDeclaration !== 2 && element.typeCd > 1) {
          worstDeclaration = element.typeCd;
        }
      });

      return this.getDeclarationDescription(worstDeclaration);
    }
  }

  getDeclarationDescription(typeCd) {
    let declarationType = window.config.declarationTypes.find(type=>{
      return type.typeCd === typeCd;
    });

    if (declarationType) {
      return declarationType.description;
    } else {
      return null;
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
        fontSize: 18
      },
      left: {
        display: 'inline-block',
        fontSize: 18,
        marginLeft: 25,
        width: '60%',
        verticalAlign: 'top'
      },
      item: {
        marginTop: 9
      },
      button: {
        margin: '7px 10px 7px 0',
        width: 200
      },
      value: {
        fontWeight: 'bold',
        marginLeft: 7,
        display: 'inline-block',
        verticalAlign: 'top'
      },
      flag: {
        float: 'right',
        position: 'relative',
        zIndex: 11
      },
      attention: {
        color: window.colorBlindModeOn ? 'black' : 'red',
        textTransform: 'capitalize'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let relationshipDialog;
    if (this.props.open) {
      relationshipDialog = (
        <EntityRelationDialog
          declarations={this.props.declarations}
          projects={this.props.projects}
          style={{display: this.props.open ? 'block' : 'none'}}
          title={this.props.title}
          type={this.props.type}
          role={this.props.role}
          sponsor={this.props.sponsor}
          cosponsor={this.props.cosponsor}
          declarationTypes={this.props.declarationTypes}
          finEntityId={this.props.entity.id}
          id={this.props.id}
          entityCount={this.props.entityCount}
          onSave={this.toggleDialog}
          onNext={this.props.onNext}
          onPrevious={this.props.onPrevious} />
      );
    }

    let relationships = [];
    this.props.entity.relationships.forEach((element) => {
      relationships.push(
        <div key={element.id}>{ConfigStore.getRelationshipPersonTypeString(element.personCd)} - {ConfigStore.getRelationshipCategoryTypeString(element.relationshipCd)}</div>
      );
    });

    let status;
    if (this.getDisplayStatus() === 'Action Required') {
      status = (
        <div style={styles.attention}>
          - {this.getDisplayStatus()} -
        </div>
      );
    }
    else {
      status = (
        <div style={{marginBottom: 10}}>
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
                <span style={{display: 'inline-block', verticalAlign: 'top'}}>Relationship:</span>
                <span style={styles.value}>
                  {relationships}
                </span>
              </div>
            </span>
            <span style={styles.right}>
              {status}

              <div>
                <KButton style={styles.button} onClick={this.toggleDialog}>Update</KButton>
              </div>
            </span>
          </div>
        </div>

        {relationshipDialog}
      </div>
    );
  }
}
