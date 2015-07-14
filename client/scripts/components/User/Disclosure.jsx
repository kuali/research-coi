import React from 'react/addons';
import {merge} from '../../merge';
import {ResponsiveComponent} from '../ResponsiveComponent';
import {Sidebar} from './Sidebar';
import {DisclosureHeader} from './DisclosureHeader';
import {Instructions} from './Instructions';
import {DisclosureStore} from '../../stores/DisclosureStore';
import {COIConstants} from '../../../../COIConstants';
import {Questionnaire} from './Questionnaire/Questionnaire';
import {QuestionnaireSummary} from './QuestionnaireSummary/QuestionnaireSummary';
import {ManualEvent} from './Manual/ManualEvent';
import {Relationships} from './Projects/Relationships';
import {Entities} from './Entities/Entities';
import {Certify} from './Certification/Certify';
import {NavSidebar} from './NavSidebar';

export class Disclosure extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.commonStyles = {};

    // Set up steps for the sidebar
    this.steps = [
      {label: 'Questionnaire', value: COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE},
      {label: 'Financial Entities', value: COIConstants.DISCLOSURE_STEP.ENTITIES}
    ];
    if (props.disclosuretype && props.disclosuretype.toLowerCase() === 'manual') {
      this.steps.push({label: 'Manual Event', value: COIConstants.DISCLOSURE_STEP.MANUAL});
    }
    else {
      this.steps.push({label: 'Project Declarations', value: COIConstants.DISCLOSURE_STEP.PROJECTS});
    }
    this.steps.push({label: 'Certification', value: COIConstants.DISCLOSURE_STEP.CERTIFY});

    let storeState = DisclosureStore.getState();
    this.state = {
      percent:0,
      applicationState: storeState.applicationState,
      entities: storeState.entities,
      projects: storeState.projects,
      declarations: storeState.declarations
    };

    this.onChange = this.onChange.bind(this);
  }

  undefinedProjectRelationExists(entities, projects, relations) {
    if (!entities || !projects) {
      return false;
    }
    else if (!relations && (entities.length > 0 || projects.length > 0)) {
      return true;
    }

    let undefinedFound = false;
    entities.forEach(entity => {
      projects.forEach(project => {
        let existingRelation = relations.find(relation => {
          return relation.entityId === entity.id && 
                 (
                  relation.projectId == project.projectid
                 );
        });

        if (!existingRelation) {
          undefinedFound = true;
        }
      });
    });

    return undefinedFound;
  }

  undefinedManualRelationExists(entities, disclosure, relations) {
    if (!entities || !disclosure) {
      return false;
    }
    else if (!relations && entities.length > 0) {
      return true;
    }

    let undefinedFound = false;
    entities.forEach(entity => {
      let existingRelation = relations.find(relation => {
        return relation.entityId === entity.id && relation.manualId == disclosure.projectId;
      });

      if (!existingRelation) {
        undefinedFound = true;
      }
    });

    return undefinedFound;
  }

  shouldComponentUpdate() {return true;}

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = DisclosureStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      entities: storeState.entities,
      projects: storeState.projects,
      declarations: storeState.declarations
    });
  }

  renderMobile() {
    let mobileStyles = {
      container: {
        height: 0,
        position: 'relative'
      },
      content: {
        backgroundColor: '#E8E9E6'
      }
    };
    let styles = merge(this.commonStyles, mobileStyles);

    return (
      <div className="flexbox column fill" style={merge(styles.container, this.props.style)}>
        <Sidebar steps={this.steps} activestep={2} />
        <DisclosureHeader>Financial Entities</DisclosureHeader>
        <div className="fill" style={styles.content}>
          Disclosure stuff will be here
        </div>
      </div>
    );
  }

  renderDesktop() {
    let currentDisclosureId = this.state.applicationState.currentDisclosureState.disclosure.id;
    let currentDisclosureState = this.state.applicationState.currentDisclosureState;
    let currentDisclosureStep = currentDisclosureState.step;
    let currentQuestion = currentDisclosureState.question;

    let desktopStyles = {
      container: {
        padding: '0'
      },
      content: {
        verticalAlign: 'top',
        width: '80%',
        display: 'inline-block',
        overflow: 'auto',
        borderTop: '8px solid ' + window.config.colors.two,
        backgroundColor: '#E5E8ED'
      },
      middle: {
        width: '75%',
        display: 'inline-block'
      },
      sidebar: {
        width: 258
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let stepNumber = 0;
    let percent = 0;
    let heading;
    let currentStep;
    let projectNextDisabled;
    switch (currentDisclosureStep) {
      case COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE:
        if (window.config.questions) {
          percent = Math.floor(((currentQuestion - 1) / window.config.questions.length) * 25);
        }

        let question = currentQuestion;
        currentStep = (
          <Questionnaire 
            questions={window.config.questions} 
            currentquestion={question} 
            disclosureid={currentDisclosureId}
            instructionsShowing={this.state.applicationState.instructionsShowing}
          />
        );
        heading = 'Questionnaire';
        break;
      case COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE_SUMMARY:
        const QUESTIONNAIRE_PERCENTAGE = 25;
        percent = QUESTIONNAIRE_PERCENTAGE;
        currentStep = (
          <QuestionnaireSummary 
            questions={window.config.questions} 
            instructionsShowing={this.state.applicationState.instructionsShowing}
            answers={this.state.applicationState.currentDisclosureState.disclosure.answers}
          />
        );
        heading = 'Questionnaire';
        break;
      case COIConstants.DISCLOSURE_STEP.ENTITIES:
        stepNumber = 1;
        const ENTITIES_PERCENTAGE = 50;
        percent = ENTITIES_PERCENTAGE;
        currentStep = (
          <Entities 
            applicationState={this.state.applicationState}
            entities={this.state.entities} 
            inProgress={this.state.applicationState.entityInProgress}
            instructionsShowing={this.state.applicationState.instructionsShowing}
          />
        );
        heading = 'Financial Entities';
        break;
      case COIConstants.DISCLOSURE_STEP.PROJECTS:
        stepNumber = 2;
        const PROJECTS_PERCENTAGE = 75;
        percent = PROJECTS_PERCENTAGE;
        let disclosureType = this.context.router.getCurrentQuery().type;
        if (disclosureType === 'Manual') {
          let disclosure = this.state.applicationState.currentDisclosureState.disclosure;
          currentStep = (
            <ManualEvent
              step={this.state.applicationState.manualStep}
              disclosure={disclosure}
              type={disclosure.manualType}
              entities={this.state.entities}
              relations={this.state.declarations}
              declarationStates={this.state.applicationState.declarationStates}
              instructionsShowing={this.state.applicationState.instructionsShowing}
            />
          );
          heading = 'Manual Event';
          projectNextDisabled = this.undefinedManualRelationExists(
            this.state.entities,
            disclosure,
            this.state.declarations
          );
        }
        else {
          currentStep = (
            <Relationships 
              projects={this.state.projects} 
              entities={this.state.entities}
              relations={this.state.declarations}
              declarationStates={this.state.applicationState.declarationStates}
              view={this.state.applicationState.declarationView}
              instructionsShowing={this.state.applicationState.instructionsShowing}
            />
          );
          heading = 'Project Declarations';
          projectNextDisabled = this.undefinedProjectRelationExists(
            this.state.entities,
            this.state.projects,
            this.state.declarations
          );
        }
        break;
      case COIConstants.DISCLOSURE_STEP.CERTIFY:
        stepNumber = 3;
        const CERTIFY_PERCENTAGE = 99;
        percent = CERTIFY_PERCENTAGE;
        currentStep = (
          <Certify 
            instructionsShowing={this.state.applicationState.instructionsShowing}
          />
        );
        heading = 'Certification';
        break;
    }

    return (
      <div className="flexbox row fill" style={merge(styles.container, this.props.style)}>
        <Sidebar style={styles.sidebar} steps={this.steps} activestep={stepNumber} />

        <span className="fill" style={styles.content}>
          <DisclosureHeader>{heading}</DisclosureHeader>

          <span style={styles.middle}>
            {currentStep}
          </span>

          <NavSidebar 
            percent={percent}
            step={currentDisclosureStep}
            question={currentQuestion}
            nextDisabled={projectNextDisabled}
          />
        </span>
      </div>
    );
  }
}

Disclosure.contextTypes = {
  router: React.PropTypes.func
};
