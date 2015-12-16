/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2015 Kuali, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/

import React from 'react';
import {merge} from '../merge';
import {processResponse, createRequest} from '../HttpUtils';
import {COIConstants} from '../../../COIConstants';

class Suggestion extends React.Component {
  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.props.value);
  }

  highlightSearchTerm(value, searchTerm) {
    if (!searchTerm) {
      return value;
    }

    const start = value.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (start >= 0) {
      const matchingValue = value.substr(start, searchTerm.length);
      return (
        <span>
          <span style={{display: 'inline'}}>{String(value.substr(0, start))}</span>
          <span className="highlight">
            {matchingValue}
          </span>
          <span style={{display: 'inline'}}>{value.substr(start + searchTerm.length)}</span>
        </span>
      );
    }

    return value;
  }

  render() {
    const styles = {
      suggestion: {
        padding: '4px 10px',
        cursor: 'pointer'
      },
      selected: {
        backgroundColor: '#EEE'
      }
    };

    return (
      <li
        style={this.props.selected ? merge(styles.suggestion, styles.selected) : styles.suggestion}
        onClick={this.onClick}
        role="option"
      >
        {this.highlightSearchTerm(this.props.value, this.props.searchTerm)}
      </li>
    );
  }
}

export default class AutoSuggest extends React.Component {
  constructor(props) {
    super();

    this.state = {
      value: props.value,
      suggestions: [],
      selectedIndex: null
    };

    this.onChange = this.onChange.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.suggestionClicked = this.suggestionClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
  }

  onSelected(newValue) {
    this.props.onSuggestionSelected(newValue);
    this.setState({
      suggestions: []
    });
  }

  onChange(evt) {
    createRequest().get(this.props.endpoint)
      .query({
        term: evt.target.value
      })
      .end(processResponse((err, suggestions) => {
        if (!err) {
          this.setState({
            suggestions: suggestions.body
          });
        }
      }));

    this.setState({
      value: evt.target.value
    });
  }

  keyUp(evt) {
    switch (evt.keyCode) { // eslint-disable-line default-case
      case COIConstants.RETURN_KEY:
        if (this.state.selectedIndex >= 0) {
          this.onSelected(this.state.suggestions[this.state.selectedIndex].value);
        }
        else {
          this.onSelected(this.state.value);
        }
        break;
      case 40: // Down arrow
        if (this.state.selectedIndex === null) {
          this.setState({
            selectedIndex: 0
          });
        }
        else if (this.state.selectedIndex < this.state.suggestions.length - 1) {
          this.setState({
            selectedIndex: this.state.selectedIndex + 1
          });
        }
        break;
      case 38: // Up arrow
        if (this.state.selectedIndex === null) {
          this.setState({
            selectedIndex: this.state.suggestions.length - 1
          });
        }
        else if (this.state.selectedIndex > 0) {
          this.setState({
            selectedIndex: this.state.selectedIndex - 1
          });
        }
        break;
    }
  }

  suggestionClicked(suggestion) {
    this.setState({
      value: suggestion
    });

    this.onSelected(suggestion);
  }

  render() {
    const styles = {
      container: {
        position: 'relative',
        width: this.props.inline ? '100%' : 'initial'
      },
      textbox: {
        width: '100%',
        height: 30,
        fontSize: 16,
        border: '1px solid #aaaaaa',
        borderRadius: 4,
        padding: 5,
        zIndex: 2,
        position: 'relative'
      },
      inlineSuggestions: {
        width: '100%',
        padding: '9px 0 12px 0',
        listStyleType: 'none',
        borderTop: '1px solid #AAA',
        marginBottom: 0,
        fontSize: 14
      },
      suggestions: {
        position: 'absolute',
        top: 22,
        backgroundColor: 'white',
        width: '100%',
        marginTop: 0,
        padding: '9px 0 12px 0',
        border: '1px solid #DDD',
        borderRadius: '0 0 5px 5px',
        listStyleType: 'none',
        marginBottom: 0
      }
    };

    let suggestionList;
    if (this.state.suggestions && this.state.suggestions.length > 0) {
      const suggestions = this.state.suggestions.map((suggestion, index) => {
        return (
          <Suggestion
            key={index}
            value={suggestion.value}
            onClick={this.suggestionClicked}
            selected={this.state.selectedIndex === index}
            searchTerm={this.state.value}
          />
        );
      });

      suggestionList = (
        <ul className="autosuggest-results" style={this.props.inline ? styles.inlineSuggestions : styles.suggestions} role="listbox">
          {suggestions}
        </ul>
      );
    }

    return (
      <span style={merge(styles.container, this.props.style)}>
        <input
          type="text"
          value={this.state.value}
          onChange={this.onChange}
          style={styles.textbox}
          onKeyUp={this.keyUp}
          aria-autocomplete="list"
          role="combobox"
          autoComplete="off"
        />
        {suggestionList}
      </span>
    );
  }
}
