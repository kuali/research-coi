/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

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

import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../merge';
import {ProgressIndicator} from './ProgressIndicator';
import {COIConstants} from '../../../../COIConstants';
import {DisclosureActions} from '../../actions/DisclosureActions';

export class NavSidebar extends React.Component {
  constructor() {
    super();

    this.submitDisclosure = this.submitDisclosure.bind(this);
  }

  submitDisclosure() {
    if (!this.props.submitDisabled) {
      DisclosureActions.submitDisclosure();
    }
  }

  goBack() {
    DisclosureActions.previousQuestion();
  }

  nextStep() {
    DisclosureActions.nextStep();
  }

  render() {
    let styles = {
      container: {
        verticalAlign: 'top',
        width: '25%',
        display: 'inline-block',
        paddingTop: 55,
        textAlign: 'center'
      },
      prevquestion: {
        margin: '14px 0 14px 0',
        fontSize: 15,
        cursor: 'pointer',
        color: window.colorBlindModeOn ? 'black' : '#555555',
        display: this.props.question <= 1 && this.props.step === COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE ? 'none' : 'block'
      },
      icons: {
        color: window.colorBlindModeOn ? 'black' : '#F57C00',
        fontSize: 29,
        marginRight: 6,
        verticalAlign: 'middle'
      },
      nextquestion: {
        margin: '14px 0 14px 0',
        fontSize: 15,
        cursor: 'pointer',
        color: window.colorBlindModeOn ? 'black' : '#555555'
      },
      navigation: {
        verticalAlign: 'top',
        width: '25%',
        display: 'inline-block',
        paddingTop: 55,
        textAlign: 'center'
      },
      stepLabel: {
        verticalAlign: 'middle'
      },
      stepButtons: {
        textAlign: 'left',
        display: 'inline-block'
      },
      disabled: {
        color: '#AAA',
        cursor: 'default'
      }
    };

    let nextStep;
    if (
      this.props.step !== COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE &&
      this.props.step !== COIConstants.DISCLOSURE_STEP.CERTIFY &&
      !this.props.nextDisabled
    ) {
      nextStep = (
        <div onClick={this.nextStep} style={styles.nextquestion}>
          <i className="fa fa-arrow-circle-right" style={styles.icons}></i>
          <span style={styles.stepLabel}>
            NEXT STEP
          </span>
        </div>
      );
    }

    let cancel;
    let submit;
    if (this.props.step === COIConstants.DISCLOSURE_STEP.CERTIFY) {
      cancel = (
        <div onClick={this.closeDisclosure} style={styles.nextquestion}>
          <i className="fa fa-times-circle" style={styles.icons}></i>
          <span style={styles.stepLabel}>
            CANCEL
          </span>
        </div>
      );

      let submitLabelStyle = styles.nextquestion;
      let submitIconStyle = styles.icons;
      if (this.props.submitDisabled) {
        submitLabelStyle = merge(submitLabelStyle, styles.disabled);
        submitIconStyle = merge(submitIconStyle, styles.disabled);
      }
      submit = (
        <div onClick={this.submitDisclosure} style={submitLabelStyle}>
          <i className="fa fa-arrow-circle-right" style={submitIconStyle}></i>
          <span style={styles.stepLabel}>
            SUBMIT
          </span>
        </div>
      );
    }

    let previousLabel;
    if (this.props.step === COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE) {
      previousLabel = 'PREVIOUS QUESTION';
    } else {
      previousLabel = 'PREVIOUS STEP';
    }

    return (
      <span style={styles.navigation}>
        <div onClick={this.advance}>
          <ProgressIndicator
            percent={this.props.percent}
            useColor={!window.colorBlindModeOn}
          />
        </div>

        <div style={styles.stepButtons}>
          <div onClick={this.goBack} style={styles.prevquestion}>
            <i className="fa fa-arrow-circle-left" style={styles.icons}></i>
            <span style={styles.stepLabel}>
              {previousLabel}
            </span>
          </div>

          {submit}
          {nextStep}
          {cancel}
        </div>
      </span>
    );
  }
}
