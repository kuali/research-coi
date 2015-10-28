import React from 'react/addons';  //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {ToggleSet} from './ToggleSet';
import EntityRelationshipSummary from '../../EntityRelationshipSummary';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import {KButton} from '../../KButton';
import RelationshipTextField from './RelationshipTextField';
import RelationshipDateField from './RelationshipDateField';

export class EntityFormRelationshipStep extends React.Component {
  constructor() {
    super();

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
    this.getMatrixType = this.getMatrixType.bind(this);
    this.amountChanged = this.amountChanged.bind(this);
    this.destinationChanged = this.destinationChanged.bind(this);
    this.startDateSelected = this.startDateSelected.bind(this);
    this.endDateSelected = this.endDateSelected.bind(this);
    this.reasonChanged = this.reasonChanged.bind(this);
    this.onRemoveRelationship = this.onRemoveRelationship.bind(this);
  }

  shouldComponentUpdate() { return true; }

  onRemoveRelationship(relationshipId, entityId) {
    this.props.onRemoveRelationship(relationshipId, entityId);
  }

  addRelation() {
    let validationErrors = DisclosureStore.entityRelationshipStepErrors();
    let isValid = Object.keys(validationErrors).length === 0;

    const stepNumber = 2;
    if (isValid) {
      this.props.onAddRelationship(this.props.appState.potentialRelationship);

      this.setState({
        relation: ''
      });
    }
    else {
      DisclosureActions.turnOnValidation(stepNumber);
    }
  }

  typeSelected() {
    DisclosureActions.setEntityRelationshipType(parseInt(this.refs.typeSelect.getDOMNode().value));
  }

  amountSelected() {
    DisclosureActions.setEntityRelationshipAmount(parseInt(this.refs.amountSelect.getDOMNode().value));
  }

  personSelected() {
    DisclosureActions.setEntityRelationshipPerson(parseInt(this.refs.personSelect.getDOMNode().value));
  }

  amountChanged(value) {
    DisclosureActions.setEntityRelationshipTravelAmount(value);
  }

  destinationChanged(value) {
    DisclosureActions.setEntityRelationshipTravelDestination(value);
  }

  startDateSelected(newDate) {
    DisclosureActions.setEntityRelationshipTravelStartDate(newDate);
  }

  endDateSelected(newDate) {
    DisclosureActions.setEntityRelationshipTravelEndDate(newDate);
  }

  reasonChanged(value) {
    DisclosureActions.setEntityRelationshipTravelReason(value);
  }
  commentChanged() {
    DisclosureActions.setEntityRelationshipComment(this.refs.commentTextArea.getDOMNode().value);
  }

  relationChosen(relation) {
    DisclosureActions.setEntityRelationshipRelation(relation);
    this.setState({
      relation: relation,
      matrixType: this.getMatrixType(relation)
    });
  }

  getMatrixType(relation) {
    return window.config.matrixTypes.find(type => {
      return type.typeCd === relation;
    });
  }

  render() {
    let validationErrors = DisclosureStore.entityRelationshipStepErrors();
    let isValid = Object.keys(validationErrors).length === 0;

    let styles = {
      container: {
        width: '100%'
      },
      title: {
        fontWeight: this.props.update ? 'normal' : 'bold',
        fontSize: 17,
        color: window.colorBlindModeOn ? 'black' : '#0095A0'
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
        backgroundColor: this.props.validating && !isValid ? '#D8D8D8' : window.colorBlindModeOn ? 'black' : '#0095A0',
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
        color: window.colorBlindModeOn ? 'black' : 'red',
        display: 'block',
        paddingBottom: 3
      }
    };

    let typeSection;
    if (this.state.relation !== '' && this.state.matrixType.typeEnabled === 1) {
      let labelStyle = {
        paddingBottom: 3
      };
      let dropDownStyle = styles.dropDown;
      if (this.props.validating && validationErrors.type) {
        labelStyle = styles.invalidText;
        dropDownStyle = merge(dropDownStyle, styles.invalidField);
      }

      let typeOptions = this.state.matrixType.typeOptions.map(typeOption => {
        return (
          <option key={typeOption.typeCd} value={typeOption.typeCd}>{typeOption.description}</option>
        );
      });

      typeSection = (
        <div style={styles.typeSection}>
          <div style={labelStyle}>Type</div>
          <select onChange={this.typeSelected} ref="typeSelect" value={this.props.appState.potentialRelationship.typeCd} style={dropDownStyle}>
            <option value="">--SELECT--</option>
            {typeOptions}
          </select>
        </div>
      );
    }

    let amountSection;
    if (this.state.relation !== '' && this.state.matrixType.amountEnabled === 1) {
      let labelStyle = {
        paddingBottom: 3
      };
      let dropDownStyle = styles.dropDown;
      if (this.props.validating && validationErrors.amount) {
        labelStyle = styles.invalidText;
        dropDownStyle = merge(dropDownStyle, styles.invalidField);
      }

      let amountTypeOptions = this.state.matrixType.amountOptions.map(type => {
        return <option key={type.typeCd} value={type.typeCd}>{type.description}</option>;
      });

      if (this.state.matrixType.description === 'Travel') {
        amountSection = (
          <RelationshipTextField
            invalid={this.props.validating && validationErrors.travelAmount ? true : false}
            onChange={this.amountChanged}
            value={this.props.appState.potentialRelationship.travel.amount}
            label='Amount'
          />
        );
      } else {
        amountSection = (
          <div style={styles.amountSection}>
            <div style={labelStyle}>Amount</div>
            <select onChange={this.amountSelected} ref="amountSelect"
                    value={this.props.appState.potentialRelationship.amountCd} style={dropDownStyle}>
              <option value="">--SELECT--</option>
              {amountTypeOptions}
            </select>
          </div>
        );
      }
    }

    let destination;
    if (this.state.relation !== '' && this.state.matrixType.destinationEnabled === 1) {
      destination = (
        <RelationshipTextField
          invalid={this.props.validating && validationErrors.travelDestination ? true : false}
          onChange={this.destinationChanged}
          value={this.props.appState.potentialRelationship.travel.destination}
          label='Destination'
        />
      );
    }


    let departureDate;
    let returnDate;
    if (this.state.relation !== '' && this.state.matrixType.dateEnabled === 1) {
      departureDate = (
        <RelationshipDateField
          invalid={this.props.validating && validationErrors.travelStartDate ? true : false}
          onChange={this.startDateSelected}
          value={this.props.appState.potentialRelationship.travel.startDate}
          label='Departure Date'
        />
      );

      returnDate = (
        <RelationshipDateField
          invalid={this.props.validating && validationErrors.travelEndDate ? true : false}
          onChange={this.endDateSelected}
          value={this.props.appState.potentialRelationship.travel.endDate}
          label='Return Date'
        />
      );
    }

    let reason;
    if (this.state.relation !== '' && this.state.matrixType.reasonEnabled === 1) {
      reason = (
        <RelationshipTextField
        invalid={this.props.validating && validationErrors.travelReason ? true : false}
        onChange={this.reasonChanged}
        value={this.props.appState.potentialRelationship.travel.reason}
        label='Reason'
        />
      );
    }

    let relationshipSummaries = [];
    if (this.props.relations) {
      relationshipSummaries = this.props.relations.map(relation => {
        return (
          <EntityRelationshipSummary
            readonly={this.props.readonly}
            entityId={this.props.id}
            style={{marginBottom: 20}}
            relationship={relation}
            key={relation.id}
            onRemove={this.onRemoveRelationship}
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
      let personLabelStyle = {
        paddingBottom: 3
      };
      let personDropDownStyle = styles.dropDown;
      if (this.props.validating && validationErrors.person) {
        personLabelStyle = styles.invalidText;
        personDropDownStyle = merge(personDropDownStyle, styles.invalidField);
      }


      let relationStyle = {};
      if (this.props.validating && validationErrors.relation) {
        relationStyle = styles.invalidText;
      }

      let commentStyle = {
        display: 'block',
        paddingBottom: 3
      };
      let commentTextboxStyle = styles.textarea;
      if (this.props.validating && validationErrors.comment) {
        commentStyle = styles.invalidText;
        commentTextboxStyle = merge(commentTextboxStyle, styles.invalidField);
      }

      let relationshipPersonTypeOptions = window.config.relationshipPersonTypes.map(option =>{
        return <option key={option.typeCd} value={option.typeCd}>{option.description}</option>;
      });

      let htmlId = Math.floor(Math.random() * 1000000000);
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
                  <select
                    onChange={this.personSelected}
                    ref="personSelect"
                    value={this.props.appState.potentialRelationship.personCd}
                    style={personDropDownStyle}
                  >
                    <option value="">--SELECT--</option>
                    {relationshipPersonTypeOptions}
                  </select>
                </div>
              </div>
              {typeSection}
              {amountSection}
              {destination}
              {departureDate}
              {returnDate}
              {reason}
            </span>
            <span style={styles.right}>
              <div style={relationStyle}>Relationship</div>
              <div>
                <ToggleSet
                  selected={this.props.appState.potentialRelationship.relationshipCd}
                  onChoose={this.relationChosen}
                  values={window.config.matrixTypes.filter(type =>{
                    return type.enabled === 1;
                  }).map(type => {
                    let value = {};
                    value.typeCd = type.typeCd;
                    value.description = type.description;
                    return value;
                  })}
                />
              </div>

              <div style={styles.commentArea}>
                <label htmlFor={htmlId} style={commentStyle}>Comments</label>
                <div>
                  <textarea id={htmlId} onChange={this.commentChanged} value={this.props.appState.potentialRelationship.comments} style={commentTextboxStyle} ref="commentTextArea" />
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
          <div style={{color: this.props.update ? 'black' : '#555', marginBottom: 12}}>Relationships:</div>
          {relationshipSummaries}
        </div>
      </div>
    );
  }
}
