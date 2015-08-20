import React from 'react/addons';  //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {ToggleSet} from './ToggleSet';
import {RelationshipSummary} from './RelationshipSummary';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import {KButton} from '../../KButton';
import {COIConstants} from '../../../../../COIConstants';

export class EntityFormPartTwo extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.state = {
      typeOptions: [],
      relation: '',
      relations: []
    };

    this.addRelation = this.addRelation.bind(this);
    this.typeSelected = this.typeSelected.bind(this);
    this.amountSelected = this.amountSelected.bind(this);
    this.personSelected = this.personSelected.bind(this);
    this.relationChosen = this.relationChosen.bind(this);
    this.commentChanged = this.commentChanged.bind(this);
  }

  shouldComponentUpdate() { return true; }

  addRelation() {
    let validationErrors = DisclosureStore.entityStepTwoErrors();
    let isValid = Object.keys(validationErrors).length === 0;

    const stepNumber = 2;
    if (isValid) {
      DisclosureActions.turnOffValidation(stepNumber);
      DisclosureActions.addEntityRelationship(this.props.id);

      this.setState({
        relation: ''
      });
    }
    else {
      DisclosureActions.turnOnValidation(stepNumber);
    }
  }

  typeSelected() {
    DisclosureActions.setEntityRelationshipType(this.refs.typeSelect.getDOMNode().value);
  }

  amountSelected() {
    DisclosureActions.setEntityRelationshipAmount(this.refs.amountSelect.getDOMNode().value);
  }

  personSelected() {
    DisclosureActions.setEntityRelationshipPerson(this.refs.personSelect.getDOMNode().value);
  }

  commentChanged() {
    DisclosureActions.setEntityRelationshipComment(this.refs.commentTextArea.getDOMNode().value);
  }

  relationChosen(relation) {
    DisclosureActions.setEntityRelationshipRelation(relation);
    this.setState({
      relation: relation
    });

    switch (relation) {
      case COIConstants.ENTITY_RELATIONSHIP.OWNERSHIP:
        this.setState({
          typeOptions: [
            'Stock',
            'Stock Options',
            'Other Ownership'
          ]
        });
        break;
      case COIConstants.ENTITY_RELATIONSHIP.OFFICES_POSITIONS:
        this.setState({
          typeOptions: [
            'Board Member',
            'Partner',
            'Other Managerial Positions',
            'Founder'
          ]
        });
        break;
      case COIConstants.ENTITY_RELATIONSHIP.INTELLECTUAL_PROPERTY:
        this.setState({
          typeOptions: [
            'Royalty Income',
            'Intellectual Property Rights'
          ]
        });
        break;
      case COIConstants.ENTITY_RELATIONSHIP.OTHER:
        this.setState({
          typeOptions: [
            'Contract',
            'Other Transactions'
          ]
        });
        break;
      default:
        this.setState({
          typeOptions: []
        });
        break;
    }
  }

  renderMobile() {}

  renderDesktop() {
    let validationErrors = DisclosureStore.entityStepTwoErrors();
    let isValid = Object.keys(validationErrors).length === 0;

    let desktopStyles = {
      container: {
        width: '100%'
      },
      title: {
        fontWeight: this.props.update ? 'normal' : 'bold',
        fontSize: 17,
        color: '#1481A3'
      },
      instructions: {
        fontSize: 14,
        marginBottom: 25,
        marginTop: 10
      },
      left: {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '30%',
        paddingRight: 40
      },
      right: {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '70%'
      },
      personSection: {
        marginBottom: 24,
        verticalAlign: 'top'
      },
      commentArea: {
        marginTop: 7
      },
      addButtonSection: {
        textAlign: 'right'
      },
      textarea: {
        height: 90,
        width: '100%',
        border: '1px solid #C7C7C7',
        fontSize: 16,
        padding: 5,
        borderRadius: 5
      },
      top: {
        marginBottom: 20
      },
      addButton: {
        backgroundColor: this.props.validating && !isValid ? '#D8D8D8' : '#1481A3',
        color: this.props.validating && !isValid ? '#939393' : 'white',
        padding: '3px 9px 4px 7px',
        marginTop: 10,
        cursor: this.props.validating && !isValid ? 'default' : 'pointer',
        width: 'initial'
      },
      submittedrelations: {
        borderTop: '1px solid #DEDEDE',
        marginRight: 14,
        paddingTop: 20
      },
      typeSection: {
        marginBottom: 24,
        display: 'block'
      },
      amountSection: {
        textAlign: 'left',
        display: 'block'
      },
      dropDown: {
        width: '100%',
        height: 27,
        backgroundColor: 'transparent',
        fontSize: 14,
        borderBottom: '1px solid #aaa'
      },
      invalidField: {
        borderBottom: '3px solid red'
      },
      invalidText: {
        color: 'red'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let typeSection;
    if (this.state.relation !== '' && this.state.relation !== 'Paid Activities') {
      let labelStyle = {};
      let dropDownStyle = styles.dropDown;
      if (this.props.validating && validationErrors.type) {
        labelStyle = styles.invalidText;
        dropDownStyle = merge(dropDownStyle, styles.invalidField);
      }

      let typeOptions = this.state.typeOptions.map(typeOption => {
        return (
          <option key={typeOption}>{typeOption}</option>
        );
      });

      typeSection = (
        <div style={styles.typeSection}>
          <div style={labelStyle}>Type</div>
          <select onChange={this.typeSelected} ref="typeSelect" value={this.props.appState.potentialRelationship.type} style={dropDownStyle}>
            <option value="">--SELECT--</option>
            {typeOptions}
          </select>
        </div>
      );
    }

    let amountSection;
    if (this.state.relation !== '' && this.state.relation !== 'Offices/Positions') {
      let labelStyle = {};
      let dropDownStyle = styles.dropDown;
      if (this.props.validating && validationErrors.amount) {
        labelStyle = styles.invalidText;
        dropDownStyle = merge(dropDownStyle, styles.invalidField);
      }

      amountSection = (
        <div style={styles.amountSection}>
          <div style={labelStyle}>Amount</div>
          <select onChange={this.amountSelected} ref="amountSelect" value={this.props.appState.potentialRelationship.amount} style={dropDownStyle}>
            <option value="">--SELECT--</option>
            <option value="$1 - $5,000">$1 - $5,000</option>
            <option value="$5,001 - $10,000">$5,001 - $10,000</option>
            <option value="Over $10,000">Over $10,000</option>
            <option value="Privately held, no valuation">Privately held, no valuation</option>
            <option value="Does not apply">Does not apply</option>
          </select>
        </div>
      );
    }

    let relationshipSummaries = [];
    if (this.props.relations) {
      relationshipSummaries = this.props.relations.map(relation => {
        return (
          <RelationshipSummary
            readonly={this.props.readonly}
            entityId={this.props.id}
            style={{marginBottom: 20}}
            id={relation.id}
            person={relation.person}
            relationship={relation.relationship}
            type={relation.type}
            amount={relation.amount}
            comment={relation.comments}
            key={relation.id}
          />
        );
      });
    }

    let heading;
    if (this.props.update) {
      heading = 'Relationship Details';
    }
    else if (this.props.name) {
      heading = this.props.name + ' Relationship Details';
    }
    else {
      heading = 'Financial Entity Relationship Details';
    }

    let relationshipEditor;
    if (!this.props.readonly) {
      let personLabelStyle = {};
      let personDropDownStyle = styles.dropDown;
      if (this.props.validating && validationErrors.person) {
        personLabelStyle = styles.invalidText;
        personDropDownStyle = merge(personDropDownStyle, styles.invalidField);
      }


      let relationStyle = {};
      if (this.props.validating && validationErrors.relation) {
        relationStyle = styles.invalidText;
      }

      let commentStyle = {};
      let commentTextboxStyle = styles.textarea;
      if (this.props.validating && validationErrors.comment) {
        commentStyle = styles.invalidText;
        commentTextboxStyle = merge(commentTextboxStyle, styles.invalidField);
      }

      relationshipEditor = (
        <div>
          <div style={styles.title}>{heading}</div>

          <div style={styles.instructions}>
            <div>Use the builder below to indicate your relationships with this Financial Entity.</div>
          </div>

          <div style={styles.top}>
            <span style={styles.left}>
              <div style={styles.personSection}>
                <div style={personLabelStyle}>Person</div>
                <div>
                  <select onChange={this.personSelected} ref="personSelect" value={this.props.appState.potentialRelationship.person} style={personDropDownStyle}>
                    <option value="">--SELECT--</option>
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Children">Children</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              {typeSection}
              {amountSection}
            </span>
            <span style={styles.right}>
              <div style={relationStyle}>Relationship</div>
              <div>
                <ToggleSet
                  selected={this.props.appState.potentialRelationship.relationship}
                  onChoose={this.relationChosen}
                  values={[
                    COIConstants.ENTITY_RELATIONSHIP.OWNERSHIP,
                    COIConstants.ENTITY_RELATIONSHIP.OFFICES_POSITIONS,
                    COIConstants.ENTITY_RELATIONSHIP.PAID_ACTIVITIES,
                    COIConstants.ENTITY_RELATIONSHIP.INTELLECTUAL_PROPERTY,
                    COIConstants.ENTITY_RELATIONSHIP.OTHER
                  ]}
                />
              </div>

              <div style={styles.commentArea}>
                <div style={commentStyle}>Comments</div>
                <div>
                  <textarea onChange={this.commentChanged} value={this.props.appState.potentialRelationship.comments} style={commentTextboxStyle} ref="commentTextArea" />
                </div>
              </div>
              <div style={styles.addButtonSection}>
                <KButton onClick={this.addRelation} title={this.props.validating && !isValid ? 'Please correct the highlighted fields' : ''} style={styles.addButton}>+ Add Additional Relationship</KButton>
              </div>
            </span>
          </div>
        </div>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        {relationshipEditor}

        <div style={!this.props.readonly ? styles.submittedrelations : {}}>
          <div style={{color: this.props.update ? 'black' : '#555', marginBottom: 12}}>My Financial Entities:</div>
          {relationshipSummaries}
        </div>
      </div>
    );
  }
}
