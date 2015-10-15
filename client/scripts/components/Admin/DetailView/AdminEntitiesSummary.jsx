import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import EntitySummary from './EntitySummary';

export class AdminEntitiesSummary extends React.Component {
  constructor() {
    super();
    this.getCommentCount = this.getCommentCount.bind(this);
  }

  getCommentCount(id) {
    return this.props.comments.filter(comment => {
      return comment.topicId === id;
    }).length;
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
      }
    };

    let entities;
    if(this.props.entities !== undefined) {
      entities = this.props.entities.filter(entity => {
        return entity.active === 1;
      })
      .map((entity, index) => {
        return (
          <EntitySummary
            key={'ent' + entity.id}
            isLast={index === this.props.entities.length - 1}
            questions={this.props.questions}
            entity={entity}
            commentCount={this.getCommentCount(entity.id)}
          />
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
