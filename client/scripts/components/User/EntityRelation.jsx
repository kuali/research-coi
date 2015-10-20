import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';
import {DisclosureActions} from '../../actions/DisclosureActions';

export class EntityRelation extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.relationChosen = this.relationChosen.bind(this);
    this.commentMade = this.commentMade.bind(this);
  }

  relationChosen(evt) {
    DisclosureActions.entityRelationChosen(this.props.relationType, this.props.entity.id, this.props.projectId, parseInt(evt.target.value));
  }

  commentMade() {
    DisclosureActions.declarationCommentedOn(this.props.relationType, this.props.entity.id, this.props.projectId, this.refs.comment.getDOMNode().value);
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

    let declarationTypeOptions = this.props.declarationTypes.map(type =>{
      return (
        <div key={type.typeCd}>
          <input
            type="radio"
            ref="none"
            checked={this.props.typeCd === type.typeCd}
            value={type.typeCd}
            onChange={this.relationChosen}
            name={this.props.entity.id + 'relation' + this.props.projectId}
          />
          <span style={{fontSize: 14, marginLeft: 6}}>{type.description}</span>
        </div>
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={{width: '25%', display: 'inline-block', verticalAlign: 'top'}}>
          {this.props.entity.name}
        </span>
        <span style={{width: '30%', display: 'inline-block', verticalAlign: 'top'}}>
          {declarationTypeOptions}
        </span>
        <span style={{width: '45%', display: 'inline-block'}}>
          <input
            type="text"
            ref="comment"
            value={this.props.comments}
            onChange={this.commentMade}
            style={styles.commentBox}
          />
        </span>
      </div>
    );
  }
}
