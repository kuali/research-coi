import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class StatusField extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.setStatus = this.setStatus.bind(this);
  }

  setStatus() {
    this.props.onChange(this.refs.select.getDOMNode().value);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        color: this.props.invalid ? 'red' : 'inherit'
      },
      value: {
        color: 'black',
        fontWeight: 'bold'
      },
      select: {
        width: 175,
        height: 27,
        backgroundColor: 'transparent',
        fontSize: 14,
        borderBottom: this.props.invalid ? '3px solid red' : '1px solid #aaa'
      },
      invalidError: {
        fontSize: 10,
        marginTop: 2
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let requiredFieldError;
    if (this.props.invalid) {
      requiredFieldError = (
        <div style={styles.invalidError}>Required Field</div>
      );
    }

    let dom;
    if (this.props.readonly) {
      dom = (
        <div style={styles.value}>{this.props.value}</div>
      );
    }
    else {
      dom = (
        <select required ref="select" value={this.props.value} onChange={this.setStatus} style={styles.select}>
          <option value="">--SELECT--</option>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
      );
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div>Status:</div>
        <div>
          {dom}
        </div>
        {requiredFieldError}
      </span>
    );
  }
}
