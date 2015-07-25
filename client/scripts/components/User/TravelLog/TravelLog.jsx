import React from 'react/addons';
import {merge} from '../../../merge';
import {TravelLogHeader} from './TravelLogHeader'
import {TravelLogForm} from './TravelLogForm'
import {BackToDashBoardButton} from './BackToDashBoardButton'
import {TravelLogStore} from '../../../stores/TravelLogStore'
import {Entry} from './Entry'
let Link = Router.Link;
import Router from 'react-router';

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
        width: 200,
        display: 'inline-block',
        backgroundColor: '#202020',
        verticalAlign: 'top',
        paddingTop: 125
      },
      content: {
        verticalAlign: 'top',
        width: '80%',
        display: 'inline-block',
        overflow: 'auto',
        borderTop: '8px solid ' + window.config.colors.two,
        backgroundColor: '#E5E8ED'
      }
    };
    styles = merge(this.commonStyles, styles);

    let travelLogs;
    if (this.state.entries.length > 0) {
      travelLogs = this.state.entries.map(travelLog => {
            return (
                <Entry travelLog={travelLog}/>
            );
          }
      );
    }

    return(
      <span className="flexbox row fill" style={merge(styles.container, this.props.style)}>
        <span style={styles.sidebar}>
          <BackToDashBoardButton/>
        </span>
        <span className="fill" style={styles.content}>
          <TravelLogHeader/>
          <TravelLogForm/>
          {travelLogs}
        </span>

      </span>
    )
  }
 }