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

import React from 'react';
import ConfigStore from '../../../../stores/config-store';
import ConfigPage from '../../config-page';
import NotificationPanels from '../notification-panels';

export default class CustomizeNotifications extends React.Component {
  constructor() {
    super();

    this.state = {
      applicationState: {}
    };
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
      config: storeState.config,
      dirty: storeState.dirty
    });
  }

  render() {

    return (
      <ConfigPage
        title='Customize Notifications'
        routeName='customize-notifications'
        dirty={this.state.dirty}
        className={this.props.className}
      >
        <NotificationPanels
          notificationTemplates ={this.state.config ? this.state.config.notificationTemplates : []}
        />
      </ConfigPage>
    );
  }
}
