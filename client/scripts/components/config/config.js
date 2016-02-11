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
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router';
import {processResponse, createRequest} from '../../http-utils';
import GeneralConfiguration from './general/general';
import QuestionnaireCustomization from './questionnaire/questionnaire';
import EntitiesQuestionnaire from './entities/questionnaire';
import RelationshipCustomization from './relationship/relationship';
import DeclarationsCustomization from './declarations/declarations';
import CertificationCustomization from './certification/certification';
import ColorStore from '../../stores/color-store';
import history from '../../history';

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
    return (
      <Router history={history}>
        <Route path="/coi/config/general" component={GeneralConfiguration} />
        <Route path="/coi/config/questionnaire" component={QuestionnaireCustomization} />
        <Route path="/coi/config/entities" component={EntitiesQuestionnaire} />
        <Route path="/coi/config/relationship" component={RelationshipCustomization} />
        <Route path="/coi/config/declarations" component={DeclarationsCustomization} />
        <Route path="/coi/config/certification" component={CertificationCustomization} />
        <Route path="/coi/config*" component={GeneralConfiguration} />
      </Router>
    );
  }
}

window.colorBlindModeOn = false;
if (window.localStorage.getItem('colorBlindModeOn') === 'true') {
  document.body.classList.add('color-blind');
  window.colorBlindModeOn = true;
}

// Then load config and re-render
createRequest()
  .get('/api/coi/config')
  .end(processResponse((err, config) => {
    if (!err) {
      window.config = config.body;
      ReactDOM.render(<App />, document.querySelector('#theApp'));
    }
  }));
