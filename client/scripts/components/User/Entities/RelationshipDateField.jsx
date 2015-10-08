import React from 'react/addons'; //eslint-disable-line no-unused-vars
import RelationshipTextField from './RelationshipTextField';
import {DatePicker} from '../../DatePicker';

export default class RelationshipDateField extends RelationshipTextField {
  constructor() {
    super();
  }

  onChange(newDate) {
    this.props.onChange(newDate);
  }

  render() {
    let styles = {
      container: {
        marginBottom: 16,
        textAlign: 'left',
        display: 'block'
      },
      textBox: {
        padding: 6,
        width: '100%',
        borderRadius: 0,
        fontSize: 16,
        border: '1px solid #B0B0B0'
      }
    };

    return (
    <div style={styles.container}>
      <div style={this.getLabelStyle(this.props.invalid)}>{this.props.label}</div>
      <DatePicker
        textFieldStyle={this.getInputStyle(this.props.invalid, styles.textBox)}
        onChange={this.onChange}
        value={this.props.value}
      />
    </div>
    );
  }
}
