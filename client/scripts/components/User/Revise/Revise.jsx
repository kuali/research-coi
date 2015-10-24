import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {PIReviewStore} from '../../../stores/PIReviewStore';
import RevisionHeader from './RevisionHeader';
import QuestionnaireSection from './QuestionnaireSection';
import EntitySection from './EntitySection';
import DeclarationSection from './DeclarationSection';
import SidePanel from './SidePanel';
import PIReviewActions from '../../../actions/PIReviewActions';
import ConfigStore from '../../../stores/ConfigStore';

export class Revise extends React.Component {
  constructor() {
    super();

    let storeState = PIReviewStore.getState();
    this.state = {
      disclosure: storeState.disclosure,
      applicationState: storeState.applicationState
    };

    this.onChange = this.onChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  componentDidMount() {
    PIReviewStore.listen(this.onChange);
    ConfigStore.listen(this.onChange);
    PIReviewActions.loadDisclosure(this.props.params.id);
  }

  componentWillUnmount() {
    ConfigStore.unlisten(this.onChange);
    PIReviewStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = PIReviewStore.getState();
    this.setState({
      disclosure: storeState.disclosure,
      applicationState: storeState.applicationState
    });
  }

  onConfirm() {
    PIReviewActions.confirm(this.props.params.id);
  }

  render() {
    let styles = {
      container: {
        backgroundColor: '#F2F2F2',
        minHeight: 100,
        overflowY: 'auto'
      },
      disclosure: {
        overflowY: 'auto'
      }
    };

    let questionnaire, entities, declarations;
    if (this.state.disclosure) {
      if (this.state.disclosure.questions && this.state.disclosure.questions.length > 0) {
        questionnaire = (
          <QuestionnaireSection
            questions={this.state.disclosure.questions}
          />
        );
      }

      if (this.state.disclosure.entities && this.state.disclosure.entities.length > 0) {
        entities = (
          <EntitySection
            entitiesToReview={this.state.disclosure.entities}
          />
        );
      }

      if (this.state.disclosure.declarations && this.state.disclosure.declarations.length > 0) {
        declarations = (
          <DeclarationSection
            declarationsToReview={this.state.disclosure.declarations}
          />
        );
      }
    }

    return (
      <div className="fill flexbox column" style={merge(styles.container, this.props.style)}>
        <RevisionHeader
          disclosureType={2}
          submittedDate={new Date()}
          returnedDate={new Date()}
        />
        <div className="flexbox row fill">
          <span className="fill" style={styles.disclosure}>
            {questionnaire}
            {entities}
            {declarations}
          </span>

          <SidePanel
            certificationText={window.config.general.certificationOptions.text}
            showingCertification={this.state.applicationState.showingCertification}
            submitEnabled={this.state.applicationState.canSubmit}
            onConfirm={this.onConfirm}
          />
        </div>
      </div>
    );
  }
}
