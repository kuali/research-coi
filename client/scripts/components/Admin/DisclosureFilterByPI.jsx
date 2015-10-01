import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {KButton} from '../KButton';
import {AdminActions} from '../../actions/AdminActions';
import DisclosureFilter from './DisclosureFilter';
import DoneWithFilterButton from './DoneWithFilterButton';
import PISearchBox from './PISearchBox';

export class DisclosureFilterByPI extends DisclosureFilter {
  constructor() {
    super();

    this.label = 'SUBMITTED BY';
  }

  clear(e) {
    AdminActions.clearSubmittedByFilter();
    e.stopPropagation();
  }

  piSelected(piName) {
    AdminActions.setSubmittedByFilter(piName);
  }

  // render() is implemented in DisclosureFilter, which will call renderFilter
  renderFilter() {
    let styles = {
      container: {
        whiteSpace: 'nowrap',
        color: 'black',
        padding: '10px 0 10px 10px',
        width: 300
      },
      clearButton: {
        backgroundColor: '#444',
        color: 'white'
      },
      searchBoxDiv: {
        borderBottom: '1px solid #AAA',
        paddingBottom: 10,
        marginBottom: 10
      }
    };

    return (
      <div style={styles.container}>
        <DoneWithFilterButton onClick={this.close} />

        <label htmlFor="pisearchbox" style={{fontSize: 13}}>SEARCH FOR NAME:</label>

        <div style={styles.searchBoxDiv}>
          <PISearchBox value={this.props.piName} onSelected={this.piSelected} />
        </div>

        <KButton style={styles.clearButton} onClick={this.clear}>CLEAR FILTER</KButton>
      </div>
    );
  }
}
