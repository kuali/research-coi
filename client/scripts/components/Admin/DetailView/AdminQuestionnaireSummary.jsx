import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import {AdminActions} from '../../../actions/AdminActions';

export class AdminQuestionnaireSummary extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.questionText = [
      'Mark territory jump launch to pounce upon little yarn mouse, bare fangs at toy run hide litter box until treats are fed so chew on cable. Make muns bathe private parts with tongue then lick owners face. Hide head under blanket so no one can see claws in your leg and give attitude, and fall over dead (not really but gets sypathy). Stare at ceiling.',
      'Cat ipsum dolor sit amet, caticus cuteicus burrow under covers but sun bathe run in circles. Intently sni hand knock dis o table head butt cant eat out of my own dish or chase ball of string. Vommit food and eat it again shake treat bag, leave dead animals as gifts, or sleep nap scratch the furniture.',
      'Purr for no reason spread kitty litter all over house or inspect anything brought into the house lick arm hair purr while eating. Scamper hide head under blanket so no one can see. Jump o balcony, onto strangers head i am the best has closed eyes but still sees you. Chase red laser dot shove bum in owners face like camera lens, sweet beast play riveting piece on synthesizer keyboard yet get video posted to internet for chasing red dot hiss at vacuum cleaner run in circles. '
    ];

    this.saveComment = this.saveComment.bind(this);
  }

  showCommentSection() {
    AdminActions.showQuestionnaireComments();
  }

  hideCommentSection() {
    AdminActions.hideQuestionnaireComments();
  }

  saveComment() {
    this.hideCommentSection();
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        border: '1px solid #999',
        boxShadow: '0 0 15px #E6E6E6'
      },
      heading: {
        backgroundColor: window.config.colors.one,
        borderBottom: '1px solid #999',
        fontSize: 25,
        color: 'white',
        padding: 10
      },
      body: {
        padding: '13px 20px'
      },
      footer: {
        borderTop: '1px solid #999',
        backgroundColor: this.props.comment && !this.props.expandedComments ? window.config.colors.three : window.config.colors.one,
        padding: '4px 15px',
        minHeight: 33,
        color: 'white'
      },
      button: {
        padding: '3px 7px',
        'float': 'right',
        marginRight: 10,
        fontSize: 12,
        width: 'initial'
      },
      answer: {
        fontSize: 25,
        textTransform: 'uppercase'
      },
      left: {
        display: 'inline-block',
        width: 57,
        verticalAlign: 'top'
      },
      text: {
        display: 'inline-block',
        width: '90%',
        verticalAlign: 'top',
        fontSize: 13
      },
      commentSection: {
        display: this.props.expandedComments ? 'block' : 'none',
        marginTop: 20
      },
      commentTitle: {
        fontWeight: 'bold',
        fontSize: 13
      },
      commentInstructions: {
        fontSize: 12,
        margin: '4px 0'
      },
      commentTextarea: {
        width: '80%',
        height: 200,
        marginBottom: 6,
        color: 'black'
      },
      question: {
        marginBottom: 10
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let questions = [];
    if(this.props.questions !== undefined) {
      for (let i = 1; i <= 3; i++) {
        questions.push(
          <div key={i} className="flexbox row" style={styles.question}>
            <span style={styles.left}>
              <div>{i}/3</div>
              <div style={styles.answer}>{this.props.questions[i]}</div>
            </span>
            <span className="fill" style={styles.text}>
              {this.questionText[i - 1]}
            </span>
          </div>
        );
      }
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.heading}>QUESTIONNAIRE</div>
        <div style={styles.body}>
          {questions}
        </div>
        <div style={styles.footer}>
          <KButton
            onClick={this.showCommentSection}
            style={merge(styles.button, {display: this.props.comment && !this.props.expandedComments ? 'inline-block' : 'none'})}>
            EDIT
          </KButton>
          <KButton
            onClick={this.saveComment}
            style={merge(styles.button, {display: this.props.expandedComments ? 'inline-block' : 'none'})}>
            SAVE
          </KButton>
          <KButton
            onClick={this.hideCommentSection}
            style={merge(styles.button, {display: this.props.expandedComments ? 'inline-block' : 'none'})}>
            CANCEL
          </KButton>
          <KButton
            onClick={this.showCommentSection}
            style={merge(styles.button, {display: this.props.expandedComments || this.props.comment ? 'none' : 'inline-block'})}>
            COMMENT
          </KButton>

          <div style={styles.commentSection}>
            <div style={styles.commentTitle}>Questionnaire Comments</div>
            <div style={styles.commentInstructions}>Add comments below for reporter to view</div>
            <textarea ref="comment" style={styles.commentTextarea}>{this.props.comment}</textarea>
          </div>
        </div>
      </div>
    );
  }
}
