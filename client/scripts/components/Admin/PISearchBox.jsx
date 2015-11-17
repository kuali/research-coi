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
        inline={true}
      />
    );
  }
}
