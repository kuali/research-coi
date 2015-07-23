import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {EntityRelationshipSummary} from './EntityRelationshipSummary';
import {KButton} from '../../KButton';
import {AdminActions} from '../../../actions/AdminActions';

export class AdminEntitiesSummary extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.saveComment = this.saveComment.bind(this);
  }

  showCommentSection() {
    AdminActions.showEntitiesComments();
  }

  hideCommentSection() {
    AdminActions.hideEntitiesComments();
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
        padding: '0 20px'
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
      descriptionLabel: {
        fontWeight: 'bold', 
        marginTop: 10, 
        marginBottom: 2
      },
      relationshipDescription: {
        fontSize: 11, 
        fontStyle: 'italic'
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
      relationshipSummary: {
        marginBottom: 10
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let entities = [];
    if(this.props.entities !== undefined) {
      for (let i = 0; i < this.props.entities.length; i++) {
        let relationships = [];
        for (let j = 0; j < this.props.entities[i].relationships.length; j++) {
          relationships.push(
            <EntityRelationshipSummary 
              key={i + ':' + j}
              style={styles.relationshipSummary} 
              relationship={this.props.entities[i].relationships[j]} 
            />
          );
        }

        entities.push(
          <div 
            key={i}
            style={(i === this.props.entities.length - 1) ? styles.lastEntity : styles.entity}
          >
          <div style={styles.name}>{this.props.entities[i].name}</div>
          <div>
            <span style={styles.left}>
              <div>
                <span style={styles.fieldLabel}>Status:</span>
                <span style={styles.fieldValue}>{this.props.entities[i].status}</span>
              </div>
              <div>
                <span style={styles.fieldLabel}>Public/Private:</span>
                <span style={styles.fieldValue}>{this.props.entities[i].public ? 'Public' : 'Private'}</span>
              </div>
              <div>
                <span style={styles.fieldLabel}>Type:</span>
                <span style={styles.fieldValue}>{this.props.entities[i].type}</span>
              </div>
              <div>
                <span style={styles.fieldLabel}>Sponsor Research:</span>
                <span style={styles.fieldValue}>{this.props.entities[i].sponsorResearch ? 'YES' : 'NO'}</span>
              </div>
              <div style={styles.descriptionLabel}>Description of Relationship</div>
              <div style={styles.relationshipDescription}>{this.props.entities[i].description}</div>
            </span>
            <span style={styles.relations}>
              <div style={styles.relationshipsLabel}>Relationship(s):</div>
              {relationships}
            </span>
          </div>
        </div>
      );
      }
    }

    return (
      <div style={merge(styles.container, this.props.style)} >
        <div style={styles.heading}>FINANCIAL ENTITIES</div>
        <div style={styles.body}>
          {entities}
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
            <div style={styles.commentTitle}>Entities Comments</div>
            <div style={styles.commentInstructions}>Add comments below for reporter to view</div>
            <textarea ref="comment" style={styles.commentTextarea}>{this.props.comment}</textarea>
          </div>
        </div>
      </div>
    );
  }
}