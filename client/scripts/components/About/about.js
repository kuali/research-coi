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

import ReactDOM from 'react-dom';
import React from 'react';
import {SizeAwareComponent} from '../SizeAwareComponent';
import ColorStore from '../../stores/ColorStore';
import aboutStyles from './aboutStyle';
import {AppHeader} from '../AppHeader';
import AboutContent from './index';

class App extends SizeAwareComponent {
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
      <div className={`${aboutStyles.container} flexbox column`} style={{height: '100%'}}>
        <AppHeader className={`${aboutStyles.override} ${aboutStyles.header}`} moduleName="About" />
        <span className={`flexbox row fill ${aboutStyles.content}`}>
          <AboutContent />
        </span>
      </div>
    );
  }
}

window.colorBlindModeOn = false;
if (window.localStorage.getItem('colorBlindModeOn') === 'true') {
  document.body.classList.add('color-blind');
  window.colorBlindModeOn = true;
}

ReactDOM.render(<App />, document.querySelector('#theApp'));
