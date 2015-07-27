import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {ResponsiveComponent} from '../ResponsiveComponent';
import {merge} from '../../merge';

export class Toggle extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {};

    this.clicked = this.clicked.bind(this);
  }

  clicked(evt) {
    this.props.onChange(evt.target.innerText);
  }

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        display: 'inline-block'
      },
      button: {
        backgroundColor: 'white',
        border: '1px solid #bbb',
        padding: '8px 20px',
        fontSize: 12,
        position: 'relative'
      },
      selected: {
        backgroundColor: window.config.colors.two,
        fontWeight: 'bold',
        color: 'white',
        zIndex: 2
      },
      unselected: {
        boxShadow: '0 0 15px #cecece'
      },
      first: {
        borderRadius: '7px 0 0 7px',
        borderRight: 0
      },
      last: {
        borderRadius: '0 7px 7px 0',
        borderLeft: 0
      },
      arrow: {
        position: 'absolute',
        width: 0,
        height: 0,
        border: '7px solid transparent',
        borderTopColor: window.config.colors.two,
        top: 31,
        right: '44%'
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let buttons = this.props.values.map((value, index, array) => {
      let arrow;
      let isFirst = index === 0;
      let isLast = index === array.length - 1;
      let isSelected = this.props.selected === value;
      if (isSelected) {
        arrow = (
          <div style={styles.arrow}></div>
        );
      }

      return (
        <button
          style={merge(
            styles.button,
            isSelected ? styles.selected : styles.unselected,
            isFirst ? styles.first : {},
            isLast ? styles.last : {}
          )}
          onClick={this.clicked}
          key={value}
        >
          {value}
          {arrow}
        </button>
      );
    });

    return (
      <span style={merge(styles.container, this.props.style)}>
        {buttons}
      </span>
    );
  }
}
