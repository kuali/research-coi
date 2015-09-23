import React from 'react/addons';
import {merge} from '../../../merge';
import Router from 'react-router';
import ConfigStore from '../../../stores/ConfigStore';
import {COIConstants} from '../../../../../COIConstants';

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
        backgroundColor: '#eeeeee',
        verticalAlign: 'top',
        padding: '20px 30px 20px 30px',
        cursor: 'pointer',
        color: '#444',
        fontWeight: '300',
        borderTop: '1px solid #c0c0c0'
      },
      primary: {
        fontSize: 28,
        fontWeight: 300
      },
      secondary: {
        fontSize: 22,
        fontWeight: 'bold'
      }
    };
    styles = merge(this.commonStyles, styles);

    return (
      <Link to="travelLog" style={merge(styles.container, this.props.style)}>
        <div>
          <span>
            <div style={styles.primary}>Update</div>
            <div style={styles.secondary}>{ConfigStore.getDisclosureTypeString(COIConstants.DISCLOSURE_TYPE.TRAVEL)}</div>
          </span>
        </div>
      </Link>
    );
  }
}
