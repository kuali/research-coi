import React from 'react/addons';
import AutoSuggest from '../AutoSuggest';

export default class PISearchBox extends React.Component {
  constructor() {
    super();

    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  onSuggestionSelected(suggestion) {
    this.props.onSelected(suggestion);
  }

  render() {
    return (
      <AutoSuggest
        endpoint='/api/coi/pi'
        value={this.props.value}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    );
  }
}
