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
import React from 'react';
import {AppHeader} from '../../../app-header';
import {TravelLogHeader} from '../travel-log-header';
import TravelLogForm from '../travel-log-form';
import TravelLogSort from '../travel-log-sort';
import {BackToDashBoardButton} from '../back-to-dash-board-button';
import {TravelLogStore} from '../../../../stores/travel-log-store';
import {TravelLogActions} from '../../../../actions/travel-log-actions';
import Entry from '../entry';

export default class TravelLog extends React.Component {
  constructor() {
    super();
    const storeState = TravelLogStore.getState();
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
    const storeState = TravelLogStore.getState();
    this.setState({
      entries: storeState.entries,
      potentialEntry: storeState.potentialEntry,
      validating: storeState.validating,
      entryStates: storeState.entryStates
    });
  }

  render() {
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
      <div className={'flexbox column'} style={{height: '100%'}} name='Travel Log'>
        <AppHeader className={`${styles.override} ${styles.header}`} moduleName={'Conflict Of Interest'} />
        <span className={`flexbox row fill ${styles.container}`}>
          <span className={styles.sidebar}>
            <BackToDashBoardButton/>
          </span>
          <span className={`fill ${styles.content}`}>
            <TravelLogHeader/>
            <TravelLogForm entry={this.state.potentialEntry} validating={this.state.validating}/>
            <div className={styles.entryList}>
              <TravelLogSort/>
              {travelLogs}
            </div>
          </span>
        </span>
      </div>
    );
  }
}
