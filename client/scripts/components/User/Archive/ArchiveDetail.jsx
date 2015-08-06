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
      disclosureDetail: storeState.archivedDisclosureDetail
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    DisclosureStore.listen(this.onChange);
    DisclosureActions.loadArchivedDisclosureDetail(this.props.params.id);
  }

  componentWillUnmount() {
    DisclosureStore.unlisten(this.onChange);
  }

  onChange() {
    let storeState = DisclosureStore.getState();
    this.setState({
      disclosureDetail: storeState.archivedDisclosureDetail
    });
  }

  shouldComponentUpdate() { return true; }

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
        padding: '0 40px 40px 40px',
        overflow: 'auto',
        maxWidth: 1100,
        margin: '0 auto'
      },
      questionnaire: {
        marginBottom: 25
      },
      entities: {
        marginBottom: 25
      },
      details: {
      }
    };
    let styles = merge(this.commonStyles, desktopStyles);
    let disclosure = this.state.disclosureDetail;

    let detail;
    if (disclosure) {
      // faking stuff!
      disclosure.questionnaire = [
        'YES',
        'NO',
        'YES'
      ];

      disclosure.entities = [
        {
          name: 'Stubbed Glaxo',
          status: 'Active',
          type: 'Large Corporation',
          relationships: [
            {
              person: 'Self',
              relationship: 'Owner',
              type: 'Stock',
              amount: '$10,000',
              comments: 'This is a company I own'
            }
          ]
        },
        {
          name: 'Stubbed Xerox',
          status: 'Active',
          type: 'Large Corporation',
          relationships: [
            {
              person: 'Self',
              relationship: 'Owner',
              type: 'Stock',
              amount: '$10,000',
              comments: 'This is a company I own'
            }
          ]
        }
      ];

      disclosure.projects = [
        {
          name: 'Project 1',
          entities: [
            {
              name: 'Stubbed Glaxo',
              conflict: true,
              comments: 'Commentario'
            },
            {
              name: 'Stubbed Xerox',
              conflict: false,
              comments: 'I think its true'
            }
          ]
        },
        {
          name: 'Project 2',
          entities: [
            {
              name: 'Stubbed Glaxo',
              conflict: false,
              comments: 'Well maybe'
            },
            {
              name: 'Stubbed Xerox',
              conflict: true,
              comments: 'We better talk'
            }
          ]
        }
      ];

      // end fake stuff

      detail = (
        <div style={styles.details} className="fill" ref="bottom">
          <QuestionnaireSummary
            questions={disclosure.questionnaire}
            style={styles.questionnaire}
            id={disclosure.id} />
          <EntitiesSummary
            entities={disclosure.entities}
            style={styles.entities}
            id={disclosure.id} />
          <DeclarationsSummary
            projects={disclosure.projects}
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
