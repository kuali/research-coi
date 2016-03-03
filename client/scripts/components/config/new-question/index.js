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
import React from 'react';
import Badge from '../badge';
import ConfigActions from '../../../actions/config-actions';
import {COIConstants} from '../../../../../coi-constants';

export default class NewQuestion extends React.Component {
  constructor() {
    super();

    this.textChanged = this.textChanged.bind(this);
    this.typeChosen = this.typeChosen.bind(this);
    this.optionTextChanged = this.optionTextChanged.bind(this);
    this.optionDeleted = this.optionDeleted.bind(this);
    this.requiredSelectionsChanged = this.requiredSelectionsChanged.bind(this);
  }

  typeChosen() {
    const dropdown = this.refs.typeDropdown;
    ConfigActions.questionTypeChosen(
      this.props.questionnaireCategory,
      this.props.id,
      dropdown.value
    );
  }

  textChanged() {
    const textarea = this.refs.questionText;
    ConfigActions.questionTextChanged(
      this.props.questionnaireCategory,
      this.props.id,
      textarea.value
    );
  }

  optionTextChanged(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      const textbox = this.refs.optionText;
      ConfigActions.multiSelectOptionAdded(
        this.props.questionnaireCategory,
        this.props.id,
        textbox.value
      );
      textbox.value = '';
    }
  }

  optionDeleted(optionId) {
    ConfigActions.multiSelectOptionDeleted(
      this.props.questionnaireCategory,
      this.props.id,
      optionId
    );
  }

  requiredSelectionsChanged() {
    const textbox = this.refs.requiredNumSelections;
    ConfigActions.requiredNumSelectionsChanged(
      this.props.questionnaireCategory,
      this.props.id,
      textbox.value
    );
  }

  render() {
    const questionTypes = Object.keys(COIConstants.QUESTION_TYPE).map(questionType => {
      return (
        <option key={questionType} value={COIConstants.QUESTION_TYPE[questionType]}>
          {COIConstants.QUESTION_TYPE[questionType]}
        </option>
      );
    });

    let multiSelectOptions, requiredSelections;
    if (this.props.question.question.type === COIConstants.QUESTION_TYPE.MULTISELECT) {
      let options;
      if (this.props.question.question.options) {
        options = this.props.question.question.options.map(option => {
          return (
            <Badge
              key={option}
              className={`${styles.override} ${styles.option}`}
              id={option}
              onDelete={this.optionDeleted}
            >
              {option}
            </Badge>
          );
        });
      }

      multiSelectOptions = (
        <div className={`flexbox row`} style={{padding: '10px 10px 0 10px'}}>
          <span className={styles.optionEnteringSection}>
            <div>
              <label className={styles.label} htmlFor="options">OPTIONS</label>
            </div>
            <div>
              <input className={styles.textbox} ref="optionText" type="text" id="options" onKeyUp={this.optionTextChanged} />
            </div>
            <div className={styles.tip}>
              (Push Enter to add another)
            </div>
          </span>
          <span className={`fill ${styles.options}`}>
            {options}
          </span>
        </div>
      );

      requiredSelections = (
        <span className={styles.requiredSelectionsSection}>
          <label className={styles.label} htmlFor="requiredNumSelections">SELECTIONS REQUIRED</label>
          <div>
            <input
              className={styles.textbox}
              type="number"
              id="requiredNumSelections"
              ref="requiredNumSelections"
              onChange={this.requiredSelectionsChanged}
              value={this.props.question.question.requiredNumSelections}
            />
          </div>
        </span>
      );
    }

    let questionType;
    if (!this.props.question.parent && this.props.questionnaireCategory === COIConstants.QUESTIONNAIRE_TYPE.SCREENING) {
      questionType = (
        <div>
          Yes/No
        </div>
      );
    } else {
      questionType = (
        <select className={styles.dropdown} value={this.props.question.question.type} ref="typeDropdown" onChange={this.typeChosen} id="questionType">
          <option>Select</option>
          {questionTypes}
        </select>
      );
    }

    return (
      <div className={classNames(styles.container, this.props.className)}>
        <div>
          <span className={styles.span}>
            <label className={styles.label} htmlFor="questionType">QUESTION TYPE</label>
            <div>
              {questionType}
            </div>
          </span>
          {requiredSelections}
        </div>
        {multiSelectOptions}
        <div className={styles.questionTextSection}>
          <label className={styles.label}>QUESTION TEXT</label>
          <div>
            <textarea ref="questionText" value={this.props.question.question.text} onChange={this.textChanged} className={styles.textarea} />
          </div>
        </div>
      </div>
    );
  }
}

NewQuestion.defaultProps = {
  question: {}
};

