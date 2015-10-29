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
        fontSize: 33,
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

      let submitStyle;
      if (this.props.submitDisabled) {
        submitStyle = merge(styles.nextquestion, styles.disabled);
      } else {
        submitStyle = styles.nextquestion;
      }
      submit = (
        <div onClick={this.submitDisclosure} style={submitStyle}>
          <i className="fa fa-arrow-circle-right" style={styles.icons}></i>
          <span style={styles.stepLabel}>
            SUBMIT
          </span>
        </div>
      );
    }

    let previousLabel;
    if (this.props.step === COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE) {
      previousLabel = 'PREVIOUS QUESTION';
    } else if (this.props.step === COIConstants.DISCLOSURE_STEP.CERTIFY) {
      previousLabel = 'BACK';
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
