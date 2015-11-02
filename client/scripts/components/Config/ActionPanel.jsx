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

import React from 'react/addons';
import {merge} from '../../merge';
import UndoButton from './UndoButton';
import SaveButton from './SaveButton';

export default class ActionPanel extends React.Component {
  render() {
    let styles = {
      container: {
        padding: '0 20px 0 35px',
        width: 235
      },
      saveAndUndo: {
        position: 'fixed',
        transition: 'opacity .1s linear',
        opacity: this.props.visible ? 1 : 0
      }
    };

    return (
      <span style={merge(styles.container, this.props.style)}>
        <div style={styles.saveAndUndo}>
          <SaveButton style={{marginBottom: 30}} />
          <UndoButton />
        </div>
      </span>
    );
  }
}
