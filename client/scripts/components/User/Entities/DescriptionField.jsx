import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class DescriptionField extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.setDescription = this.setDescription.bind(this);
  }

  setDescription() {
    this.props.onChange(this.refs.description.getDOMNode().value);
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
      description: {
        width: '100%',
        height: 90,
        border: '1px solid #C7C7C7',
        fontSize: 16,
        padding: 5,
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
        <textarea 
          required
          ref="description" 
          onChange={this.setDescription} 
          style={styles.description}
          value={this.props.value}
        />
      );
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={{fontSize: 13}}>Describe the entity's area of business and your relationship to it:</div>
        <div>
          {dom}
        </div>
        {requiredFieldError}
      </span>
    );
  }
}