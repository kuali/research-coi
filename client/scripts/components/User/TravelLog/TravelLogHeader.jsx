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
        borderBottom: '1px solid #e3e3e3'        
      },
      heading: {
        fontSize: '33px',
        margin: '0 0 0 0',
        'textTransform': 'uppercase',
        fontWeight: 300,
        color: window.config.colors.one
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