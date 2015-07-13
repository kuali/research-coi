import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class SponsorField extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.setSponsor = this.setSponsor.bind(this);
  }

  setSponsor() {
    this.props.onChange(this.refs.sponsorYes.getDOMNode().checked);
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
        <div style={styles.value}>
          {this.props.value}
        </div>
      );
    }
    else {
      dom = (
        <div>
          <span style={{display: 'inline-block', width: 50, marginLeft: 15}}>
            <div><input checked={this.props.value === 'Yes'} ref="sponsorYes" onChange={this.setSponsor} name="isSponsor" type="radio" /></div>
            <div>YES</div>
          </span>
          <span style={{display: 'inline-block', width: 50}}>
            <div><input checked={this.props.value === 'No'} ref="sponsorNo" onChange={this.setSponsor} name="isSponsor" type="radio" /></div>
            <div>NO</div>
          </span>
        </div>
      );
    }
    return (
      <span style={merge(styles.container, this.props.style)}>
        <div>
          Does this entity sponsor any of your research?
        </div>
        {dom}
        {requiredFieldError}
      </span>
    );
  }
}