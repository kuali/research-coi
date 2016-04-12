/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import styles from './style';
import classNames from 'classnames';
import React from 'react';  //eslint-disable-line no-unused-vars
import {ToggleSet} from '../toggle-set';
import EntityRelationshipSummary from '../../../entity-relationship-summary';
import {DisclosureActions} from '../../../../actions/disclosure-actions';
import {DisclosureStore} from '../../../../stores/disclosure-store';
import {BlueButton} from '../../../blue-button';
import RelationshipTextField from '../relationship-text-field';
import RelationshipDateField from '../relationship-date-field';

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
    this.resetPotentialRelationship = this.resetPotentialRelationship.bind(this);
  }

  shouldComponentUpdate() { return true; }

  onRemoveRelationship(relationshipId, entityId) {
    this.props.onRemoveRelationship(relationshipId, entityId);
  }

  addRelation() {
    const validationErrors = DisclosureStore.entityRelationshipStepErrors(this.props.id);
    const isValid = Object.keys(validationErrors).length === 0;

    const stepNumber = 2;
    if (isValid) {
      this.props.onAddRelationship(this.props.appState.potentialRelationships[this.props.id]);

      this.setState({
        relation: ''
      });
    }
    else {
      DisclosureActions.turnOnValidation(stepNumber);
    }
  }

  resetPotentialRelationship() {
    const id = this.props.id ? this.props.id : 'new';
    DisclosureActions.resetPotentialRelationship(id);
  }

  typeSelected() {
    DisclosureActions.setEntityRelationshipType(
      parseInt(this.refs.typeSelect.value),
      this.props.id
    );
  }

  amountSelected() {
    DisclosureActions.setEntityRelationshipAmount(
      parseInt(this.refs.amountSelect.value),
      this.props.id
    );
  }

  personSelected() {
    DisclosureActions.setEntityRelationshipPerson(
      parseInt(this.refs.personSelect.value),
      this.props.id
    );
  }

  amountChanged(value) {
    DisclosureActions.setEntityRelationshipTravelAmount(value, this.props.id);
  }

  destinationChanged(value) {
    DisclosureActions.setEntityRelationshipTravelDestination(value, this.props.id);
  }

  startDateSelected(newDate) {
    DisclosureActions.setEntityRelationshipTravelStartDate(newDate, this.props.id);
  }

  endDateSelected(newDate) {
    DisclosureActions.setEntityRelationshipTravelEndDate(newDate, this.props.id);
  }

  reasonChanged(value) {
    DisclosureActions.setEntityRelationshipTravelReason(value, this.props.id);
  }
  commentChanged() {
    DisclosureActions.setEntityRelationshipComment(this.refs.commentTextArea.value, this.props.id);
  }

  relationChosen(relation) {
    DisclosureActions.setEntityRelationshipRelation(relation, this.props.id);
    this.setState({
      relation,
      matrixType: this.getMatrixType(relation)
    });
  }

  getMatrixType(relation) {
    return window.config.matrixTypes.find(type => {
      return type.typeCd === relation;
    });
  }

  render() {
    let potentialRelationship;
    if (this.props.appState) {
      if (this.props.id) {
        potentialRelationship = this.props.appState.potentialRelationships[this.props.id];
      }
      else {
        potentialRelationship = this.props.appState.potentialRelationships.new;
      }
    }
    if (!potentialRelationship) {
      potentialRelationship = {
        comments: '',
        typeCd: '',
        amountCd: '',
        personCd: '',
        relationshipCd: '',
        travel: {
          amount: 0,
          destination: '',
          startDate: 0,
          endDate: 0,
          reason: ''
        }
      };
    }

    const validationErrors = DisclosureStore.entityRelationshipStepErrors(this.props.id);
    const isValid = Object.keys(validationErrors).length === 0;

    let typeSection;
    if (this.state.relation !== '' && this.state.matrixType.typeEnabled === 1) {
      let dropDownStyle = styles.dropDown;
      let labelStyle = styles.labelStyle;
      if (this.props.validating && validationErrors.type) {
        labelStyle = styles.invalidText;
        dropDownStyle += ` ${styles.invalidField}`;
      }

      const typeOptions = this.state.matrixType.typeOptions.map(typeOption => {
        return (
          <option key={typeOption.typeCd} value={typeOption.typeCd} id={`type_option_${typeOption.typeCd}`}>{typeOption.description}</option>
        );
      });

      typeSection = (
        <div className={styles.typeSection}>
          <div className={labelStyle}>TYPE</div>
          <select
            id="relationType"
            onChange={this.typeSelected}
            ref="typeSelect"
            value={potentialRelationship.typeCd}
            className={dropDownStyle}
          >
            <option value="">--SELECT--</option>
            {typeOptions}
          </select>
        </div>
      );
    }

    let amountSection;
    if (this.state.relation !== '' && this.state.matrixType.amountEnabled === 1) {
      let labelStyle = styles.labelStyle;
      let dropDownStyle = styles.dropDown;
      if (this.props.validating && validationErrors.amount) {
        labelStyle = styles.invalidText;
        dropDownStyle += ` ${styles.invalidField}`;
      }

      const amountTypeOptions = this.state.matrixType.amountOptions.map(type => {
        return <option key={type.typeCd} value={type.typeCd} id={`amount_option_${type.typeCd}`}>{type.description}</option>;
      });

      if (this.state.matrixType.description === 'Travel') {
        amountSection = (
          <RelationshipTextField
            invalid={this.props.validating && validationErrors.travelAmount ? true : false}
            onChange={this.amountChanged}
            value={potentialRelationship.travel.amount}
            label='Amount'
          />
        );
      } else {
        amountSection = (
          <div className={styles.amountSection}>
            <div className={labelStyle}>AMOUNT</div>
            <select
              id="amountType"
              onChange={this.amountSelected}
              ref="amountSelect"
              value={potentialRelationship.amountCd}
              className={dropDownStyle}
            >
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
          value={potentialRelationship.travel.destination}
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
          value={potentialRelationship.travel.startDate}
          label='Departure Date'
        />
      );

      returnDate = (
        <RelationshipDateField
          invalid={this.props.validating && validationErrors.travelEndDate ? true : false}
          onChange={this.endDateSelected}
          value={potentialRelationship.travel.endDate}
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
          value={potentialRelationship.travel.reason}
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
            className={`${styles.override} ${styles.summary}`}
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
      heading = `${this.props.name} Relationship Details`;
    }
    else {
      heading = 'Financial Entity Relationship Details';
    }

    let relationshipEditor;
    if (!this.props.readonly) {
      let personLabelStyle = styles.labelStyle;
      let personDropDownStyle = styles.dropDown;
      if (this.props.validating && validationErrors.person) {
        personLabelStyle = styles.invalidText;
        personDropDownStyle += ` ${styles.invalidField}`;
      }


      let relationStyle = styles.relationStyle;
      if (this.props.validating && validationErrors.relation) {
        relationStyle = styles.invalidText;
      }

      let commentStyle = styles.commentStyle;
      let commentTextboxStyle = styles.textarea;
      if (this.props.validating && validationErrors.comment) {
        commentStyle = styles.invalidText;
        commentTextboxStyle += ` ${styles.invalidField}`;
      }

      const relationshipPersonTypeOptions = window.config.relationshipPersonTypes.map(personType => {
        return (
          <option key={personType.typeCd} value={personType.typeCd} id={`person_type_option_${personType.typeCd}`}>
            {personType.description}
          </option>
        );
      });

      const htmlId = Math.floor(Math.random() * 1000000000);
      relationshipEditor = (
        <div>
          <div className={styles.title}>{heading}</div>

          <div className={styles.instructions}>
            <div>Use the builder below to indicate your relationships with this Financial Entity.</div>
          </div>

          <div className={styles.top}>
            <span className={styles.left}>
              <div className={styles.personSection}>
                <div className={personLabelStyle}>PERSON</div>
                <div>
                  <select
                    id="personType"
                    onChange={this.personSelected}
                    ref="personSelect"
                    value={potentialRelationship.personCd}
                    className={personDropDownStyle}
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
            <span className={styles.right}>
              <div className={relationStyle}>RELATIONSHIP</div>
              <div>
                <ToggleSet
                  selected={potentialRelationship.relationshipCd}
                  onChoose={this.relationChosen}
                  values={window.config.matrixTypes.filter(type => {
                    return type.enabled === 1;
                  }).map(type => {
                    const value = {};
                    value.typeCd = type.typeCd;
                    value.description = type.description;
                    return value;
                  })}
                />
              </div>

              <div className={styles.commentArea}>
                <label htmlFor={htmlId} className={commentStyle}>COMMENTS</label>
                <div>
                  <textarea
                    id={htmlId}
                    onChange={this.commentChanged}
                    value={potentialRelationship.comments}
                    className={commentTextboxStyle}
                    ref="commentTextArea"
                  />
                </div>
              </div>
              <div className={styles.addButtonSection}>
                <BlueButton
                  id='addAdditionalRelationship'
                  onClick={this.addRelation}
                  title={this.props.validating && !isValid ? 'Please correct the highlighted fields' : ''}
                  className={`${styles.override} ${styles.addButton}`}
                >
                  + Add Additional Relationship
                </BlueButton>

                <BlueButton
                  id='resetAdditionalRelationship'
                  onClick={this.resetPotentialRelationship}
                  style={{marginLeft: '10px'}}
                  className={styles.removeButton}
                >
                  Remove Additional Relationship
                </BlueButton>
              </div>
            </span>
          </div>
        </div>
      );
    }

    let relationshipSummariesSection;
    if (relationshipSummaries.length > 0) {
      relationshipSummariesSection = (
        <div className={classNames({[styles.submittedrelations]: !this.props.readonly})}>
          <div style={{color: window.colorBlindModeOn ? 'black' : '#888', marginBottom: 10, fontSize: 12}}>
            RELATIONSHIPS
          </div>
          {relationshipSummaries}
        </div>
      );
    }

    const classes = classNames(
      styles.container,
      this.props.className,
      {[styles.update]: this.props.update},
      {[styles.errors]: this.props.validating && !isValid}
    );

    return (
      <div className={classes}>
        {relationshipEditor}
        {relationshipSummariesSection}
      </div>
    );
  }
}
