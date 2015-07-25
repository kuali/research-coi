import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';
import {Toggle} from './Toggle';

export class ToggleSet extends ResponsiveComponent {
  constructor(props) {
    super();
    this.commonStyles = {};

    this.state = {
      value: props.selected
    };

    this.change = this.change.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.selected !== this.props.selected) {
      this.setState({
        value: newProps.selected
      });
    }
  }

  change(newValue) {
    this.setState({value: newValue});
    this.props.onChoose(newValue);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
      },
      toggle: {
        margin: '0 10px 10px 0'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let toggles = this.props.values.map(value => {
      return (
        <Toggle
          style={styles.toggle}
          text={value}
          selected={this.state.value === value}
          onClick={this.change}
          key={value}
         />
      );
    });

    return (
      <div style={merge(styles.container, this.props.style)}>
        {toggles}
      </div>
    );
  }
}
