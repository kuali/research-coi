import React from 'react/addons';
import {merge} from '../../../merge';
import EntityToReview from './EntityToReview';

export default class EntitySection extends React.Component {
  render() {
    let styles = {
      container: {
        margin: '25px 20px 25px 35px',
        backgroundColor: 'white',
        borderRadius: 5,
        boxShadow: '0 0 10px 2px #DDD',
        overflow: 'hidden'
      },
      title: {
        fontSize: 23,
        padding: '10px 18px',
        borderBottom: '1px solid #DDD',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        color: 'white'
      },
      body: {
        padding: 23
      }
    };

    let entities = this.props.entitiesToReview.map((entitytoReview, index) => {
      return (
        <EntityToReview
          key={entitytoReview.id}
          entity={entitytoReview}
          respondedTo={entitytoReview.respondedTo}
          revised={entitytoReview.revised}
          style={{marginBottom: index === this.props.entitiesToReview.length - 1 ? 0 : 50}}
        />
      );
    });

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>
          FINANCIAL ENTITIES
        </div>
        <div className="fill" style={styles.body}>
          {entities}
        </div>
      </div>
    );
  }
}
