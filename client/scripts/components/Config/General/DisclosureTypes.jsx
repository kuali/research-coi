import React from 'react/addons';
import {merge} from '../../../merge';
import DisclosureType from './DisclosureType';

export default class DisclosureTypes extends React.Component {
  constructor() {
    super();
  }

  render() {
    let styles = {
      container: {
        padding: '20px 23px 10px 23px',
        fontSize: 15
      },
      optionRow: {
        paddingBottom: 20
      },
      editLink: {
        marginLeft: 10
      },
      checkbox: {
        marginRight: 10
      },
      title: {
        fontSize: 12,
        marginBottom: 10
      }
    };

    let rows;
    if (this.props.types && this.props.types.length > 0) {
      rows = (
        <span>
          <div style={styles.optionRow}>
            <DisclosureType type={this.props.types[1]} canToggle={false} />
          </div>
          <div style={styles.optionRow}>
          </div>
        </span>
      );
    }

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div style={styles.title}>DISCLOSURE TITLE</div>
        {rows}
      </div>
    );
  }
}
