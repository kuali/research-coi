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

import React from 'react/addons';
import {merge} from '../../../merge';
import ConfigActions from '../../../actions/ConfigActions';

export default class SponsorLookup extends React.Component {
  constructor() {
    super();

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    let checkbox = React.findDOMNode(this.refs.checkbox);
    if (checkbox.checked) {
      ConfigActions.enableSponsorLookup();
    } else {
      ConfigActions.disableSponsorLookup();
    }
  }

  render() {
    let styles = {
      container: {
        padding: '20px 23px 10px 23px',
        fontSize: 17
      },
      title: {
        fontSize: 11,
        marginBottom: 10
      },
      checkbox: {
        verticalAlign: 'middle',
        marginRight: 10
      }
    };

    return (
      <div style={merge(styles.container, this.props.style)}>
        <div>
          <input ref="checkbox" id="sponsorLookupToggle" type="checkbox" checked={this.props.enabled} style={styles.checkbox} onChange={this.toggle} />
          <label htmlFor="sponsorLookupToggle" style={{verticalAlign: 'middle'}}>Lookup financial entities from legacy system?</label>
        </div>
      </div>
    );
  }
}
