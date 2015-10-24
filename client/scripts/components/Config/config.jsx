import React from 'react/addons';
import Router from 'react-router';
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;
let RouteHandler = Router.RouteHandler;
import {merge} from '../../merge';
import {processResponse, createRequest} from '../../HttpUtils';
import {AppHeader} from '../AppHeader';
import GeneralConfiguration from './General/General';
import QuestionnaireCustomization from './Questionnaire/Questionnaire';
import EntitiesQuestionnaire from './Entities/Questionnaire';
import RelationshipCustomization from './Relationship/Relationship';
import DeclarationsCustomization from './Declarations/Declarations';
import CertificationCustomization from './Certification/Certification';
import ColorStore from '../../stores/ColorStore';

class App extends React.Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    ColorStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ColorStore.unlisten(this.onChange);
  }

  onChange() {
    this.forceUpdate();
  }

  render() {
    let styles = {
      container: {
        height: '100%'
      },
      header: {
        boxShadow: '0 1px 6px #D1D1D1',
        zIndex: 9,
        position: 'relative'
      }
    };

    return (
      <div className="flexbox column" style={merge(styles.container, this.props.style)}>
        <AppHeader style={styles.header} homelink="general" />
        <RouteHandler />
      </div>
    );
  }
}

let routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="general" path="/general" handler={GeneralConfiguration} />
    <Route name="questionnaire" path="/questionnaire" handler={QuestionnaireCustomization} />
    <Route name="entities" path="/entities" handler={EntitiesQuestionnaire} />
    <Route name="relationship" path="/relationship" handler={RelationshipCustomization} />
    <Route name="declarations" path="/declarations" handler={DeclarationsCustomization} />
    <Route name="certification" path="/certification" handler={CertificationCustomization} />
    <DefaultRoute handler={GeneralConfiguration} />
  </Route>
);

window.colorBlindModeOn = window.localStorage.getItem('colorBlindModeOn') === 'true';

// Then load config and re-render
createRequest().get('/api/coi/config')
.end(processResponse((err, config) => {
  if (!err) {
    window.config = config.body;
    Router.run(routes, (Handler, state) => {
      React.render(<Handler state={state} />, document.body);
    });
  }
}));

