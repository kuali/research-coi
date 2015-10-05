import React from 'react/addons';
import {merge} from '../../../merge';
import {formatDate} from '../../../formatDate';
import ConfigStore from '../../../stores/ConfigStore';

export default class RevisionHeader extends React.Component {
  render() {
    let styles = {
      container: {
        backgroundColor: 'white'
      },
      disclosureType: {
        display: 'inline-block',
        borderRight: '2px solid #ABABAB',
        fontSize: 30,
        fontWeight: 300,
        paddingRight: 22,
        margin: '10px 22px 10px 48px',
        verticalAlign: 'middle'
      },
      dates: {
        display: 'inline-block',
        verticalAlign: 'middle',
        fontWeight: 'bold',
        fontSize: 15
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <span style={styles.disclosureType}>
          {ConfigStore.getDisclosureTypeString(this.props.disclosureType).toUpperCase()}
        </span>
        <span style={styles.dates}>
          <div>Submitted on {formatDate(this.props.submittedDate)}</div>
          <div>Returned for Revisions on {formatDate(this.props.returnedDate)}</div>
        </span>
      </div>
    );
  }
}
