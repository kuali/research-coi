import React from 'react/addons'; //eslint-disable-line no-unused-vars
import {merge} from '../../../merge';
import {ResponsiveComponent} from '../../ResponsiveComponent';
import {DisclosureStore} from '../../../stores/DisclosureStore';
import {DisclosureActions} from '../../../actions/DisclosureActions';
import {DeclarationsSummary} from './DeclarationsSummary';
import {EntitiesSummary} from './EntitiesSummary';
import {QuestionnaireSummary} from './QuestionnaireSummary';

export class ArchiveDetail extends ResponsiveComponent {
  constructor() {
    super();
    this.commonStyles = {
    };

    let storeState = DisclosureStore.getState();
    this.state = {
      // applicationState: storeState.applicationState,
      archivedDisclosures: storeState.archivedDisclosures
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    DisclosureActions.loadArchivedDisclosures();
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = DisclosureStore.getState();
    this.setState({
      // applicationState: storeState.applicationState,
      archivedDisclosures: storeState.archivedDisclosures
    });
  }

  shouldComponentUpdate() {return true;}

  renderMobile() {}

  renderDesktop() {
    let desktopStyles = {
      container: {
        width: '100%',
        background: '#DDD'
      },
      sidebar: {
        width: 225,
        display: 'inline-block',
        backgroundColor: '#202020',
        verticalAlign: 'top',
        paddingTop: 125
      },
      content: {
        
      },
      questionnaire: {
        marginBottom: 25
      },
      entities: {
        marginBottom: 25
      }      
    };
    let styles = merge(this.commonStyles, desktopStyles);

    let disclosure = {};
    if (this.props.params.id) {
      disclosure = this.state.archivedDisclosures.find(disclosure => {
        return disclosure.id === this.props.params.id;
      });      
    }

    let detail;
    if (disclosure) {
      detail = (
        <div className="fill" ref="bottom">
          <QuestionnaireSummary 
            questions={disclosure.questionnaire} 
            style={styles.questionnaire} 
            id={disclosure.id} />
          <EntitiesSummary 
            entities={disclosure.entities} 
            style={styles.entities}
            id={disclosure.id} />
          <DeclarationsSummary 
            names={nameMap} 
            relationships={disclosure.projects}
            id={disclosure.id} />
        </div>      
      );
    }

    return (
      <span className="flexbox row fill" style={merge(styles.container, this.props.style)}>
        <span className="fill" style={styles.content}>
          <div style={styles.header}>
            <h2 style={styles.heading}>Disclosure Detail</h2>
          </div>

          {detail}
        </span>
      </span>
    );
  }
}