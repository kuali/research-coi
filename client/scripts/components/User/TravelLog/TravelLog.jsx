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
import {merge} from '../../../merge';
import {AppHeader} from '../../AppHeader';
import {TravelLogHeader} from './TravelLogHeader';
import TravelLogForm from './TravelLogForm';
import TravelLogSort from './TravelLogSort';
import {BackToDashBoardButton} from './BackToDashBoardButton';
import {TravelLogStore} from '../../../stores/TravelLogStore';
import {TravelLogActions} from '../../../actions/TravelLogActions';
import Entry from './Entry';

export class TravelLog extends React.Component {
  constructor() {
    super();
    this.commonStyles = {
    };

    let storeState = TravelLogStore.getState();
    this.state = {
      entries: storeState.entries,
      potentialEntry: storeState.potentialEntry,
      validating: storeState.validating,
      entryStates: storeState.entryStates
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    TravelLogStore.listen(this.onChange);
    TravelLogActions.loadTravelLogEntries();
  }

  componentWillUnmount() {
    TravelLogStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = TravelLogStore.getState();
    this.setState({
      entries: storeState.entries,
      potentialEntry: storeState.potentialEntry,
      validating: storeState.validating,
      entryStates: storeState.entryStates
    });
  }

  render() {
    let styles = {
      header: {
        boxShadow: '0 1px 6px #D1D1D1',
        zIndex: 10,
        position: 'relative'
      },
      top: {
        marginTop: 20
      },
      sidebar: {
        minWidth: 300,
        display: 'inline-block',
        backgroundColor: '#eeeeee',
        verticalAlign: 'top',
        paddingTop: 125,
        boxShadow: '2px 1px 8px #D5D5D5',
        zIndex: 9
      },
      content: {
        verticalAlign: 'top',
        width: '80%',
        display: 'inline-block',
        overflow: 'auto',
        backgroundColor: '#eeeeee'
      },
      entryList: {
        maxWidth: 900,
        margin: '44px 50px',
        borderTop: '1px solid #CCC',
        paddingTop: '44px'
      }
    };
    styles = merge(this.commonStyles, styles);

    let travelLogs;
    if (this.state.entries.length > 0) {
      travelLogs = this.state.entries.map(travelLog => {
        return (
          <Entry
            key={travelLog.relationshipId}
            travelLog={travelLog}
            editing={this.state.entryStates[travelLog.relationshipId] ? this.state.entryStates[travelLog.relationshipId].editing : false}
            validating={this.state.entryStates[travelLog.relationshipId] ? this.state.entryStates[travelLog.relationshipId].validating : false}
          />
        );
      });
    }

    return (
      <div className="flexbox column" style={{height: '100%'}}>
        <AppHeader style={styles.header} />
        <span className="flexbox row fill" style={merge(styles.container, this.props.style)}>
          <span style={styles.sidebar}>
            <BackToDashBoardButton/>
          </span>
          <span className="fill" style={styles.content}>
            <TravelLogHeader/>
            <TravelLogForm entry={this.state.potentialEntry} validating={this.state.validating}/>
            <div style={styles.entryList}>
              <TravelLogSort/>
              {travelLogs}
            </div>
          </span>
        </span>
      </div>
    );
  }
}
