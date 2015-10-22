import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../merge';
import {SearchIcon} from '../DynamicIcons/SearchIcon';

export class DisclosureFilterSearch extends React.Component {
  constructor() {
    super();
    this.valueChanged = this.valueChanged.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.search = this.search.bind(this);
  }

  search() {
    if (this.props.onSearch) {
      this.props.onSearch();
    }
  }

  keyUp(evt) {
    if (evt.keyCode === 13 && this.props.onSearch) {
      this.props.onSearch();
    }
  }

  valueChanged(evt) {
    this.props.onChange(evt.target.value);
  }


  render() {
    let styles = {
      container: {
        width: '100%',
        backgroundColor: window.colorBlindModeOn ? 'black' : '#0095A0',
        padding: '13px 10px',
        textAlign: 'center'
      },
      input: {
        border: 0,
        padding: '2px 3px 1px 5px',
        backgroundColor: 'white',
        outline: 0,
        height: 25,
        fontSize: 16,
        width: 175,
        verticalAlign: 'middle',
        borderRadius: '0 5px 5px 0'
      },
      magnifyingGlass: {
        width: 25,
        height: 25,
        color: 'white',
        backgroundColor: '#414141',
        padding: '6px 0 2px 0',
        verticalAlign: 'middle',
        borderRadius: '5px 0 0 5px'
      }
    };

    let currentValue = this.props.query || '';
    return (
      <div style={merge(styles.container, this.props.styles)}>
        <SearchIcon style={styles.magnifyingGlass} onClick={this.search} />
        <input placeholder="Search" style={styles.input} type="text" onChange={this.valueChanged} onKeyUp={this.keyUp} value={currentValue} />
      </div>
    );
  }
}
