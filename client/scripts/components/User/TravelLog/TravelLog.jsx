import React from 'react/addons';
import {merge} from '../../../merge';
import {TravelLogHeader} from './TravelLogHeader';
import {TravelLogForm} from './TravelLogForm';
import {TravelLogSort} from './TravelLogSort.jsx';
import {BackToDashBoardButton} from './BackToDashBoardButton';
import {TravelLogStore} from '../../../stores/TravelLogStore';
import {TravelLogActions} from '../../../actions/TravelLogActions';
import {Entry} from './Entry';

export class TravelLog extends React.Component {
  constructor() {
    super();
    this.commonStyles = {
    };

    let storeState = TravelLogStore.getState();
    this.state = {
      entries: storeState.entries
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
      entries: storeState.entries
    });
  }

  render() {
    let styles = {
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
        width: '65%',
        margin: '44px 50px',
        borderTop: '1px solid grey',
        paddingTop: '44px'
      }
    };
    styles = merge(this.commonStyles, styles);

    let travelLogs;
    if (this.state.entries.length > 0) {
      travelLogs = this.state.entries.map(travelLog => {
        return (
          <Entry travelLog={travelLog}/>
        );
      });
    }

    return (
      <span className="flexbox row fill" style={merge(styles.container, this.props.style)}>
        <span style={styles.sidebar}>
          <BackToDashBoardButton/>
        </span>
        <span className="fill" style={styles.content}>
          <TravelLogHeader/>
          <TravelLogForm/>
          <div style={styles.entryList}>
            <TravelLogSort/>
            {travelLogs}
          </div>
        </span>

      </span>
    );
  }
}
