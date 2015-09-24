import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../merge';
import ToggleButton from './ToggleButton';

export class Toggle extends React.Component {
  constructor() {
    super();
    this.commonStyles = {};

    this.clicked = this.clicked.bind(this);
  }

  clicked(value) {
    this.props.onChange(value.code);
  }

  render() {
    let styles = {
      container: {
        display: 'inline-block'
      },
      first: {
        borderRadius: '7px 0 0 7px',
        borderRight: 0
      },
      last: {
        borderRadius: '0 7px 7px 0',
        borderLeft: 0
      }
    };

    let buttons = this.props.values.map((value, index, array) => {
      let isFirst = index === 0;
      let isLast = index === array.length - 1;
      let isSelected = this.props.selected === value.code;

      return (
        <ToggleButton
          style={merge(
            isFirst ? styles.first : {},
            isLast ? styles.last : {}
          )}
          onClick={this.clicked}
          value={value}
          key={value.code}
          isSelected={isSelected}
        />
      );
    });

    return (
      <span style={merge(styles.container, this.props.style)}>
        {buttons}
      </span>
    );
  }
}
