import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import EntitySummary from './EntitySummary';

export default class extends React.Component {
  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        boxShadow: '0 0 8px #AAA',
        borderRadius: 5,
        overflow: 'hidden'
      },
      heading: {
        borderBottom: '1px solid #999',
        fontSize: 25,
        color: 'black',
        padding: 10
      },
      body: {
        padding: '0 20px'
      }
    };

    let entities;
    if(this.props.entities !== undefined) {
      entities = this.props.entities.filter(entity => {
        return entity.active;
      }).map((entity, index, array) => {
        return (
          <EntitySummary
            key={entity.id}
            isLast={index === array.length - 1}
            questions={this.props.questions}
            entity={entity}
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
