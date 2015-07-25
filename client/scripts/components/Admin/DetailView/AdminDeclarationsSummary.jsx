import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {KButton} from '../../KButton';
import {AdminActions} from '../../../actions/AdminActions';

export class AdminDeclarationsSummary extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.saveComment = this.saveComment.bind(this);
  }

  showCommentSection() {
    AdminActions.showProjectComments();
  }

  hideCommentSection() {
    AdminActions.hideProjectComments();
  }

  saveComment() {
    this.hideCommentSection();
  }

  renderMobile() {}

  renderDesktop() {
    let findEntityName = id => {
      return this.props.names[id];
    };

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
      name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 11
      },
      titles: {
        borderBottom: '1px solid #ccc',
        color: '#888',
        fontSize: 12,
        marginBottom: 10
      },
      entityName: {
        width: '25%',
        display: 'inline-block'
      },
      conflict: {
        width: '25%',
        display: 'inline-block'
      },
      comments: {
        width: '50%',
        display: 'inline-block',
        verticalAlign: 'top'
      },
      relationship: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottom: '2px solid #666'
      },
      lastrelationship: {
        paddingBottom: 15,
        borderBottom: 0
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
      declaration: {
        fontSize: 12,
        marginBottom: 10
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let relationships = [];
    if(this.props.relationships !== undefined &&
      this.props.relationships.conflicts !== undefined) {
      for (let i = 0; i < this.props.relationships.length; i++) {
        let conflicts = [];
        for (let j = 0; j < this.props.relationships[i].conflicts.length; j++) {
          conflicts.push(
            <div
              key={this.props.relationships[i].conflicts[j].id}
              style={styles.declaration}
            >
              <span style={merge(styles.entityName, {fontWeight: 'bold'})}>
                {findEntityName(this.props.relationships[i].conflicts[j].id)}
              </span>
              <span style={merge(styles.conflict, {fontWeight: 'bold'})}>
                {this.props.relationships[i].conflicts[j].conflict ? 'Conflict' : 'No Conflict'}
              </span>
              <span style={merge(styles.comments, {fontStyle: 'italic'})}>
                {this.props.relationships[i].conflicts[j].comments}
              </span>
            </div>
          );
        }

        let projectName = this.props.relationships[i].name;
        relationships.push(
          <div
            key={projectName}
          stylestyle={i === this.props.relationships.length - 1 ? styles.lastrelationship : styles.relationship}
          >
            <div style={styles.name}>{projectName}</div>
            <div style={styles.titles}>
              <span style={styles.entityName}>FINANCIAL ENTITY</span>
              <span style={styles.conflict}>REPORTER RELATIONSHIP</span>
              <span style={styles.comments}>REPORTER COMMENTS</span>
            </div>
            {conflicts}
          </div>
        );
      }
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.heading}>PROJECT DECLARATIONS</div>
        <div style={styles.body}>
          {relationships}
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
            <div style={styles.commentTitle}>Project Declaration Comments</div>
            <div style={styles.commentInstructions}>Add comments below for reporter to view</div>
            <textarea ref="comment" style={styles.commentTextarea}>{this.props.comment}</textarea>
          </div>
        </div>
      </div>
    );
  }
}
