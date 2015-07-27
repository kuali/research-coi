import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {DisclosureActions} from '../../../actions/DisclosureActions';

export class ProjectRelation extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.relationChosen = this.relationChosen.bind(this);
    this.commentMade = this.commentMade.bind(this);
  }

  relationChosen() {
    let relation = 'NONE';
    if (this.refs.potential.getDOMNode().checked) {
      relation = 'POTENTIAL';
    }
    else if(this.refs.managed.getDOMNode().checked) {
      relation = 'MANAGED';
    }
    DisclosureActions.entityRelationChosen('PROJECT', this.props.entityId, this.props.project.projectid, relation);
  }

  commentMade() {
    DisclosureActions.declarationCommentedOn('PROJECT', this.props.entityId, this.props.project.projectid, this.refs.comment.getDOMNode().value);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        padding: '10px 0 3px 0',
        borderTop: '1px solid #C3C3C3',
        fontSize: 15
      },
      commentBox: {
        height: 35,
        padding: 5,
        border: '1px solid #8D8D8D',
        fontSize: 15,
        borderRadius: 5,
        width: '90%'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={{width: '25%', display: 'inline-block', verticalAlign: 'top'}}>
          {this.props.project.title}
        </span>
        <span style={{width: '30%', display: 'inline-block', verticalAlign: 'top'}}>
          <div>
            <input
              type="radio"
              ref="none"
              checked={this.props.relation === 'NONE'}
              onChange={this.relationChosen}
              name={this.props.project.projectid + 'relation' + this.props.entityId}
            />
            <span style={{fontSize: 14, marginLeft: 6}}>No Conflict</span>
          </div>
          <div>
            <input
              type="radio"
              ref="potential"
              checked={this.props.relation === 'POTENTIAL'}
              onChange={this.relationChosen}
              name={this.props.project.projectid + 'relation' + this.props.entityId}
            />
            <span style={{fontSize: 14, marginLeft: 6}}>Potential Relationship</span>
          </div>
          <div>
            <input
              type="radio"
              ref="managed"
              checked={this.props.relation === 'MANAGED'}
              onChange={this.relationChosen}
              name={this.props.project.projectid + 'relation' + this.props.entityId}
            />
            <span style={{fontSize: 14, marginLeft: 6}}>Managed Relationship</span>
          </div>
        </span>
        <span style={{width: '45%', display: 'inline-block'}}>
          <input type="text" ref="comment" value={this.props.comments} onChange={this.commentMade} style={styles.commentBox}/>
        </span>
      </div>
    );
  }
}
