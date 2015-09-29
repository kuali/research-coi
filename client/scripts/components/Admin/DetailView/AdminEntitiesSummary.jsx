import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import EntityRelationshipSummary from '../../EntityRelationshipSummary';
import {COIConstants} from '../../../../../COIConstants';
import {formatDate} from '../../../formatDate';
import {AdminActions} from '../../../actions/AdminActions';

export class AdminEntitiesSummary extends React.Component {
  constructor() {
    super();

    this.getQuestionAnswer = this.getQuestionAnswer.bind(this);
  }

  showComments() {
    AdminActions.showCommentingPanel();
  }

  getQuestionAnswer(questionId, entity, type) {
    let theAnswer = entity.answers.find(answer => {
      return answer.questionId === questionId;
    });
    if (!theAnswer) {
      return '';
    }
    else {
      switch (type) {
        case COIConstants.QUESTION_TYPE.DATE:
          if (isNaN(theAnswer.answer.value)) {
            return theAnswer.answer.value;
          }
          else {
            return formatDate(theAnswer.answer.value);
          }
          break;
        case COIConstants.QUESTION_TYPE.TEXTAREA:
          return (
            <div>
              {theAnswer.answer.value}
            </div>
          );
        case COIConstants.QUESTION_TYPE.MULTISELECT:
          if (Array.isArray(theAnswer.answer.value)) {
            let answers = theAnswer.answer.value.map((answer, index, array) => {
              let answerToShow = answer;
              if (index !== array.length - 1) {
                answerToShow += ', ';
              }
              return (
                <span key={'ans' + questionId + index}>{answerToShow}</span>
              );
            });

            return (
              <div>
                {answers}
              </div>
            );
          }
          else {
            return theAnswer.answer.value;
          }
          break;
        default:
          return theAnswer.answer.value;
      }
    }
  }

  render() {
    let styles = {
      container: {
        border: '1px solid #999',
        boxShadow: '0 0 10px #BBB',
        borderRadius: 8,
        overflow: 'hidden'
      },
      heading: {
        backgroundColor: '#1481A3',
        borderBottom: '1px solid #999',
        fontSize: 25,
        color: 'white',
        padding: 10
      },
      body: {
        padding: '0 20px'
      },
      relations: {
        display: 'inline-block',
        width: '60%',
        verticalAlign: 'top'
      },
      left: {
        display: 'inline-block',
        width: '40%',
        verticalAlign: 'top',
        fontSize: 13,
        paddingRight: 4
      },
      fieldLabel: {
        fontWeight: 'bold',
        display: 'inline-block'
      },
      fieldValue: {
        marginLeft: 4,
        display: 'inline-block'
      },
      relationshipsLabel: {
        fontSize: 15,
        marginBottom: 8
      },
      name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 11
      },
      entity: {
        borderBottom: '1px solid #999',
        padding: '20px 0'
      },
      lastEntity: {
        padding: '20px 0'
      },
      commentLink: {
        fontSize: 14,
        cursor: 'pointer',
        margin: '25px 0 34px 0',
        textAlign: 'right'
      },
      relationshipSummary: {
        marginBottom: 10
      }
    };

    let entities;
    if(this.props.entities !== undefined) {
      entities = this.props.entities.map((entity, index) => {
        let relationships = entity.relationships.map(relationship => {
          return (
            <EntityRelationshipSummary
              key={'rel' + relationship.id}
              style={styles.relationshipSummary}
              person={relationship.person}
              relationship={relationship.relationship}
              type={relationship.type}
              amount={relationship.amount}
              comment={relationship.comments}
              readonly={true}
            />
          );
        });

        let fields = this.props.questions.map(question => {
          return (
            <div key={'qa' + question.id} style={{marginBottom: 8}}>
              <span style={styles.fieldLabel}>{question.text}:</span>
              <span style={styles.fieldValue}>{this.getQuestionAnswer(question.id, entity, question.type)}</span>
            </div>
          );
        });
        return (
          <div
            key={'ent' + entity.id}
            style={(index === this.props.entities.length - 1) ? styles.lastEntity : styles.entity}
          >
            <div style={styles.name}>{entity.name}</div>
            <div>
              <span style={styles.left}>
                {fields}
              </span>
              <span style={styles.relations}>
                <div style={styles.relationshipsLabel}>Relationship(s):</div>
                {relationships}

                <div style={styles.commentLink} onClick={this.showComments}>
                  <span style={{borderBottom: '1px dotted black', paddingBottom: 3}}>COMMENTS (999)</span>
                </div>
              </span>
            </div>
          </div>
        );
      });
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.heading}>FINANCIAL ENTITIES</div>
        <div style={styles.body}>
          {entities}
        </div>
      </div>
    );
  }
}
