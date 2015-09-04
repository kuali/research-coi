import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class TypeField extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.setType = this.setType.bind(this);
    this.getTypeDescription = this.getTypeDescription.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  setType() {
    this.props.onChange(parseInt(this.refs.type.getDOMNode().value));
  }

  getTypeDescription(cd) {
    let description;
    this.props.options.forEach(option => {
      if (option.typeCd === cd ) {
        description = option.description;
      }
    });
    return description;
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
        <div style={styles.value}>{this.getTypeDescription(this.props.value)}</div>
      );
    }
    else {
      let options = this.props.options.map(option =>{
        return <option key={option.typeCd} value={option.typeCd}>{option.description}</option>;
      });
      dom = (
        <select required value={this.props.value} ref="type" onChange={this.setType} style={styles.select}>
          <option value="">--SELECT--</option>
          {options}
        </select>
      );
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div>Type:</div>
        <div>
          {dom}
        </div>
        {requiredFieldError}
      </span>
    );
  }
}
