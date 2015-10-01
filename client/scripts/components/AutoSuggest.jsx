import React from 'react/addons';
import {merge} from '../merge';
import request from 'superagent';
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

    let start = value.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (start >= 0) {
      let matchingValue = value.substr(start, searchTerm.length);
      return (
        <span>
          {value.substr(0, start) + ''}
          <span className="highlight">
            {matchingValue}
          </span>
          {value.substr(start + searchTerm.length)}
        </span>
      );
    }
    else {
      return value;
    }
  }

  render() {
    let styles = {
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
    request.get(this.props.endpoint)
      .query({
        term: evt.target.value
      })
      .end((err, suggestions) => {
        if (!err) {
          this.setState({
            suggestions: suggestions.body
          });
        }
      });

    this.setState({
      value: evt.target.value
    });
  }

  keyUp(evt) {
    switch (evt.keyCode) {
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
    let styles = {
      container: {
        position: 'relative'
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
      let suggestions = this.state.suggestions.map((suggestion, index) => {
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
        <ul className="autosuggest-results" style={styles.suggestions} role="listbox">
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
