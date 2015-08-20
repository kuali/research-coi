import React from 'react/addons';

export class TravelLogSort extends React.Component {
  constructor() {
    super();
    this.commonStyles = {};
  }

  render() {
    let styles = {
      container: {
      },
      select: {
        width: 175,
        height: 27,
        fontSize: 14,
        borderBottom: this.props.invalid ? '3px solid red' : '1px solid #aaa'
      },
      value: {
        color: 'black',
        fontWeight: 'bold'
      },
      label: {
        fontSize: 14,
        marginRight: '5px'
      }
    };

    return (
      <div style={styles.container}>
        <div>
          <span style={styles.label}>Sort By:</span>
          <select style={styles.select}>
            <option value="Entity Name">Entity Name</option>
            <option value="Date">Date</option>
            <option value="Destination">Destination</option>
            <option value="Amount">Amount</option>
          </select>
          <span style={styles.label}></span>
          <select style={styles.select}>
            <option value="Ascending">Ascending</option>
            <option value="Descending">Descending</option>
          </select>
          <div style={{float: 'right'}}>
            <span style={styles.label}>View By:</span>
            <select style={styles.select}>
              <option value="All">All</option>
              <option value="Already Disclosed">Already Disclosed</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}
