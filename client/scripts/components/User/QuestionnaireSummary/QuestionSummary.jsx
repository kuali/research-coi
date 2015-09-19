import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class QuestionSummary extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.reviewQuestion = this.reviewQuestion.bind(this);
  }

  reviewQuestion() {
    DisclosureActions.setCurrentQuestion(+(this.props.questionId));
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        margin: '30px 0px'
      },
      option: {
        display: 'inline-block',
        marginRight: 30
      },
      counter: {
        display: 'inline-block',
        width: '10%',
        fontSize: 17,
        verticalAlign: 'top'
      },
      controls: {
        marginTop: 20
      },
      radio: {
        width: 36,
        height: '4em'
      },
      nums: {
        fontSize: 38,
        marginLeft: 10,
        color: '#1481A3'
      },
      question: {
        width: '78%',
        display: 'inline-block',
        marginTop: 3,
        lineHeight: '22px'
      },
      answer: {
        display: 'inline-block',
        width: '12%',
        verticalAlign: 'top',
        textAlign: 'right'
      },
      editlink: {
        fontSize: 12,
        margin: '10px 0 0 8px',
        color: '#1481A3',
        cursor: 'pointer',
        borderBottom: '1px dotted #1481A3',
        display: 'inline-block'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let answer = this.props.answer;

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.counter}>
          <span style={styles.nums}>
            {this.props.number}
          </span>
        </span>

        <span style={styles.question}>{this.props.text}</span>

        <span style={styles.answer}>
          <div style={{fontSize: 25}}>{answer}</div>
          <span onClick={this.reviewQuestion} style={styles.editlink}>&lt; EDIT</span>
        </span>
      </div>
    );
  }
}
