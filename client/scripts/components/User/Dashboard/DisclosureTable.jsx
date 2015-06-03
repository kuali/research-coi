import React from 'react/addons';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {merge} from '../../../merge';

export class DisclosureTable extends ResponsiveComponent {
  render() {
    let styles = {
      container: {
      }
    };

    return (
      <span style={merge(styles.container, this.props.style)}>
      </span>
    );
  }
}