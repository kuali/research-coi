import React from 'react/addons';
import {merge} from '../../../merge';

export class TravelLogHeader extends React.Component {
  constructor() {
    super();
    this.commonStyles = {
    };
  }

  render() {
    let styles = {
      container: {
        backgroundColor: 'white',
        padding: '17px 0 17px 50px',
        position: 'relative',
        boxShadow: '0 2px 8px #D5D5D5'
      },
      heading: {
        fontSize: '33px',
        margin: '0 0 0 0',
        textTransform: 'uppercase',
        fontWeight: 300,
        color: '#444'
      }
    };
    styles = merge(this.commonStyles, styles);

    return (
      <div style={merge(styles.container, this.props.style)}>
        <h2 style={styles.heading}>
         Travel Log
        </h2>
      </div>
    );
  }
}
