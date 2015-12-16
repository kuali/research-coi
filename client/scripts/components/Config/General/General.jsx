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
import Sidebar from '../Sidebar';
import Panel from '../Panel';
import ActionPanel from '../ActionPanel';
import DisclosureTypes from './DisclosureTypes';
import ConfigStore from '../../../stores/ConfigStore';
import DueDateDetails from './DueDateDetails';
import {AppHeader} from '../../AppHeader';

export default class General extends React.Component {
  constructor() {
    super();

    this.state = {};
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.onChange();
    ConfigStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ConfigStore.unlisten(this.onChange);
  }

  onChange() {
    const storeState = ConfigStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      disclosureTypes: storeState.config.disclosureTypes,
      dueDate: storeState.config.general.dueDate,
      isRollingDueDate: storeState.config.general.isRollingDueDate,
      notifications: storeState.config.notifications,
      sponsorLookup: storeState.config.general.sponsorLookup,
      dirty: storeState.dirty
    });
  }

  render() {
    const styles = {
      container: {
      },
      header: {
        boxShadow: '0 1px 6px #D1D1D1',
        zIndex: 10,
        position: 'relative'
      },
      content: {
        backgroundColor: '#F2F2F2',
        boxShadow: '2px 8px 8px #ccc inset',
        minHeight: 0
      },
      stepTitle: {
        boxShadow: '0 2px 8px #D5D5D5',
        fontSize: 33,
        textTransform: 'uppercase',
        padding: '15px 15px 15px 35px',
        color: '#525252',
        fontWeight: 300,
        backgroundColor: 'white',
        minHeight: 70
      },
      configurationArea: {
        padding: 35,
        overflowY: 'auto',
        minHeight: 0
      }
    };

    return (
      <div className="flexbox column" style={{height: '100%'}}>
        <AppHeader style={styles.header} />
        <span className="fill flexbox row" style={merge(styles.container, this.props.style)}>
          <Sidebar active="general" />
          <span style={styles.content} className="inline-flexbox column fill">
            <div style={styles.stepTitle}>
              General Configuration
            </div>
            <div className="fill flexbox row" style={styles.configurationArea}>
              <span className="fill" style={{display: 'inline-block'}}>
                <Panel
                  title="General Disclosure Configuration"
                  style={{overflow: 'visible'}}
                >
                  <DisclosureTypes
                    types={this.state.disclosureTypes}
                    appState={this.state.applicationState}
                  />

                  <DueDateDetails
                    isRollingDueDate={this.state.isRollingDueDate}
                    dueDate={this.state.dueDate}
                    showTitleQuestion={false}
                  />
                </Panel>

                {/*<Panel title="Expiration Notifications">
                  <NotificationDetails
                    dueDate={this.state.dueDate}
                    isRollingDueDate={this.state.isRollingDueDate}
                    notifications={this.state.notifications}
                    appState={this.state.applicationState}
                  />
                </Panel>*/}
              </span>
              <ActionPanel visible={this.state.dirty} />
            </div>
          </span>
        </span>
      </div>
    );
  }
}
