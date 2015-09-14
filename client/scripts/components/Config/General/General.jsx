import React from 'react/addons';
import {merge} from '../../../merge';
import Sidebar from '../Sidebar';
import Panel from '../Panel';
import ActionPanel from '../ActionPanel';
import DisclosureTypes from './DisclosureTypes';
import NotificationDetails from './NotificationDetails';
import ConfigStore from '../../../stores/ConfigStore';
import SponsorLookup from './SponsorLookup';

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
    let storeState = ConfigStore.getState();
    this.setState({
      applicationState: storeState.applicationState,
      disclosureTypes: storeState.disclosureTypes,
      dueDate: storeState.dueDate,
      isRollingDueDate: storeState.isRollingDueDate,
      notifications: storeState.notifications,
      sponsorLookup: storeState.sponsorLookup,
      dirty: storeState.dirty
    });
  }

  render() {
    let styles = {
      container: {
      },
      content: {
        backgroundColor: '#eeeeee',
        boxShadow: '2px 8px 8px #ccc inset'
      },
      stepTitle: {
        boxShadow: '0 2px 8px #D5D5D5',
        fontSize: 33,
        textTransform: 'uppercase',
        padding: '15px 15px 15px 35px',
        color: '#525252',
        fontWeight: 300,
        backgroundColor: 'white',
        minHeight: 68
      },
      configurationArea: {
        padding: 35,
        overflowY: 'auto',
        minHeight: 0
      }
    };

    return (
      <span className="fill flexbox row" style={merge(styles.container, this.props.style)}>
        <Sidebar active="general" />
        <span style={styles.content} className="inline-flexbox column fill">
          <div style={styles.stepTitle}>
            General Configuration
          </div>
          <div className="fill flexbox row" style={styles.configurationArea}>
            <span className="fill">
              <Panel title="Disclosure Types">
                <DisclosureTypes
                  types={this.state.disclosureTypes}
                  appState={this.state.applicationState}
                />

                <SponsorLookup enabled={this.state.sponsorLookup} />
              </Panel>

              <Panel title="Expiration Notifications">
                <NotificationDetails
                  dueDate={this.state.dueDate}
                  isRollingDueDate={this.state.isRollingDueDate}
                  notifications={this.state.notifications}
                  appState={this.state.applicationState}
                />
              </Panel>
            </span>
            <ActionPanel visible={this.state.dirty} />
          </div>
        </span>
      </span>
    );
  }
}
