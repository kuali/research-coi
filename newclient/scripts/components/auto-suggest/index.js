/*
    The Conflict of Interest (COI) module of Kuali Research
    Copyright © 2005-2016 Kuali, Inc.

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

import styles from './style';
import classNames from 'classnames';
import React from 'react';
import {processResponse, createRequest} from '../../http-utils';
import {RETURN_KEY} from '../../../../coi-constants';

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

  onSelected(suggestion) {
    this.props.onSuggestionSelected(suggestion);
    this.setState({
      suggestions: []
    });
  }

  onChange(evt) {
    if (!evt.target.value) {
      this.setState({
        suggestions: []
      });
    } else {
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
    }

    this.setState({
      value: evt.target.value
    });
  }

  keyUp(evt) {
    switch (evt.keyCode) { // eslint-disable-line default-case
      case RETURN_KEY:
        if (this.state.selectedIndex >= 0) {
          this.onSelected(this.state.suggestions[this.state.selectedIndex]);
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
      value: suggestion.value
    });

    this.onSelected(suggestion);
  }

  render() {
    let suggestionList;
    const Suggestion = this.props.suggestion;

    if (this.state.suggestions && this.state.suggestions.length > 0) {
      let filteredSuggestions;
      if (this.props.filter) {
        filteredSuggestions = this.props.filter(this.state.suggestions);
      } else {
        filteredSuggestions = this.state.suggestions;
      }
      const suggestions = filteredSuggestions.map((suggestion, index) => {
        return (
          <Suggestion
            key={index}
            suggestion={suggestion}
            onClick={this.suggestionClicked}
            selected={this.state.selectedIndex === index}
            searchTerm={this.state.value}
          />
        );
      });

      suggestionList = (
        <ul
          className={classNames(
            'autosuggest-results',
            {[styles.inlineSuggestions]: this.props.inline},
            {[styles.suggestions]: !this.props.inline}
          )}
          role="listbox"
        >
          {suggestions}
        </ul>
      );
    }
    const classes = classNames(
      {[styles.inline]: this.props.inline},
      styles.container,
      this.props.className
    );

    return (
      <span className={classes}>
        <input
          type="text"
          value={this.state.value || ''}
          onChange={this.onChange}
          className={styles.textbox}
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
