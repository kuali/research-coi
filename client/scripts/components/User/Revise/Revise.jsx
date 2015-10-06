import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {PIReviewStore} from '../../../stores/PIReviewStore';
import RevisionHeader from './RevisionHeader';
import QuestionnaireSection from './QuestionnaireSection';
import EntitySection from './EntitySection';
import DeclarationSection from './DeclarationSection';
import SidePanel from './SidePanel';
import {COIConstants} from '../../../../../COIConstants';
import PIReviewActions from '../../../actions/PIReviewActions';

export class Revise extends React.Component {
  constructor() {
    super();

    let storeState = PIReviewStore.getState();
    this.state = {
      disclosure: storeState.disclosure
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    PIReviewStore.listen(this.onChange);
    PIReviewActions.loadDisclosure(this.props.params.id);
  }

  componentWillUnmount() {
    PIReviewStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = PIReviewStore.getState();
    this.setState({
      disclosure: storeState.disclosure
    });
  }

  render() {
    let styles = {
      container: {
        backgroundColor: '#F2F2F2'
      },
      disclosure: {
        overflowY: 'auto'
      }
    };

    let comments = [
      {
        date: (new Date().getTime() - 100000000),
        text: 'You did a pretty good job with this... but not good enough. We need you to try again and not mess things up this time.',
        author: 'Yrag Nosrekliw',
        id: 22
      },
      {
        date: new Date(),
        text: 'Just to clarify what we need: Can you answer this question more precisely.  Is it true or is it false?',
        author: 'Leoj Nilhed',
        id: 33
      }
    ];

    let questions = [
      {
        completed: false,
        numberToShow: '2/5',
        text: 'This is the question text. Do you have a fear of bears, snakes, or rats? This is the question text.  Do you have a fear of bears, snakes, or rats? This is the question text.  Do you have a fear of bears, snakes, or rats? This is the question text.  Do you have a fear of bears, snakes, or rats? This is the question text.  Do you have a fear of bears, snakes, or rats? This is the question text.  Do you have a fear of bears, snakes, or rats? This is the question text.  Do you have a fear of bears, snakes, or rats?',
        answer: 'Yes',
        type: COIConstants.QUESTION_TYPE.YESNO,
        comments: comments,
        id: 44
      },
      {
        completed: true,
        numberToShow: '4/5',
        text: 'Have you ever been sent money by a relative?',
        answer: 'Yes',
        type: COIConstants.QUESTION_TYPE.YESNO,
        comments: comments,
        id: 55
      }
    ];

    let entitiesToReview = [
      {
        completed: true,
        comments: comments,
        entity: {
        }
      },
      {
        completed: false,
        comments: comments,
        entity: {
        }
      }
    ];

    let details;
    if (this.state.disclosure) {
      details = (
        <span className="fill" style={styles.disclosure}>
          <QuestionnaireSection
            questions={this.state.disclosure.questions}
          />
          <EntitySection
            entitiesToReview={entitiesToReview}
          />
          <DeclarationSection />
        </span>
      );
    }

    let certText = 'This should be the configured value! This should be the configured value! This should be the configured value! This should be the configured value! This should be the configured value! This should be the configured value! This should be the configured value! This should be the configured value! This should be the configured value! ';
    return (
      <div className="fill flexbox column" style={merge(styles.container, this.props.style)}>
        <RevisionHeader
          disclosureType={2}
          submittedDate={new Date()}
          returnedDate={new Date()}
        />
        <div className="flexbox row fill">
          {details}

          <SidePanel
            certificationText={certText}
            showingCertification={false}
            submitEnabled={false}
          />
        </div>
      </div>
    );
  }
}
