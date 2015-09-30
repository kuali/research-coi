import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import {COIConstants} from '../../../../../COIConstants';
import {AdminActions} from '../../../actions/AdminActions';

export default class QuestionSummary extends React.Component {
  constructor() {
    super();

    this.showComments = this.showComments.bind(this);
  }

  showComments() {
    AdminActions.showCommentingPanel(COIConstants.DISCLOSURE_STEP.QUESTIONNAIRE, this.props.question.id, 'Question #' + this.props.question.numberToShow);
  }

  render() {
    let styles = {
      container: {
        marginBottom: 10
      },
      number: {
        width: 50,
        fontSize: 20
      },
      subQuestionNumber: {
        width: 100,
        fontSize: 20,
        paddingLeft: 50
      },
      answer: {
        fontSize: 13,
        marginTop: 4
      },
      commentLink: {
        display: 'inline-block',
        width: 125,
        fontSize: 14,
        cursor: 'pointer',
        marginTop: 7
      },
      answerSection: {
        display: 'inline-block',
        borderBottom: '1px solid #CCC',
        paddingBottom: 12,
        margin: '7px 5px 7px 0',
        fontSize: 15
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)} className="flexbox row">
        <span style={this.props.question.parent ? styles.subQuestionNumber : styles.number}>
          <div>{this.props.question.numberToShow}</div>
        </span>
        <span className="fill">
          <div style={{paddingRight: 125, fontSize: 14}}>{this.props.question.text}</div>
          <div className="flexbox row">
            <span className="fill" style={styles.answerSection}>
              <div>ANSWER</div>
              <div style={styles.answer}>
                {this.props.question.type === COIConstants.QUESTION_TYPE.DATE ? formatDate(this.props.answer) : this.props.answer}
              </div>
            </span>
            <span style={styles.commentLink} onClick={this.showComments}>
              <span style={{borderBottom: '1px dotted black', paddingBottom: 3}}>COMMENTS ({this.props.commentCount})</span>
            </span>
          </div>
        </span>
      </div>
    );
  }
}
