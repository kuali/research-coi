import React from 'react/addons';
import {merge} from '../../../merge';
import Router from 'react-router';
let Link = Router.Link;

export class TravelLogButton extends React.Component {
   constructor() {
    super();
    this.commonStyles = {
    };
  }

  render() {
    let styles = {
      container: {
        display: 'block',
        backgroundColor: window.config.colors.three,
        verticalAlign: 'top',
        padding: '20px 30px 20px 30px',
        cursor: 'pointer',
        color: 'white',
        fontWeight: '300',
        marginBottom: 5
      },
      primary: {
        fontSize: 25
      },
      secondary: {
        fontSize: 22
      }
    };
    styles = merge(this.commonStyles, styles);

    return (
      <Link to="travelLog" style={merge(styles.container, this.props.style)}>
        <div>
          <span>
            <div style={styles.secondary}>Travel Log</div>
          </span>
        </div>
      </Link>
    );
  }  
}