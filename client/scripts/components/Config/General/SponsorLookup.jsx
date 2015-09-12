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
        <div style={styles.title}>SPONSOR LOOKUP</div>
        <div>
          <input ref="checkbox" id="sponsorLookupToggle" type="checkbox" checked={this.props.enabled} style={styles.checkbox} onChange={this.toggle} />
          <label htmlFor="sponsorLookupToggle" style={{verticalAlign: 'middle'}}>Lookup financial entities from legacy system?</label>
        </div>
      </div>
    );
  }
}
