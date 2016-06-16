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

import ConfigActions from '../../../../actions/config-actions';
import {COIConstants} from '../../../../../../coi-constants';
import Type from '../type';
import styles from './style';

export default class DeclarationType extends Type {
  constructor() {
    super();
  }

  typeIsBeingEdited(type) {
    return this.props.applicationState.declarationsTypesBeingEdited[type.typeCd] !== undefined;
  }

  moveUp() {
    this.refs.container.previousSibling.classList.add(styles.down);
    this.refs.container.classList.add(styles.up);
    setTimeout(() => {
      this.refs.container.classList.remove(styles.up);
      this.refs.container.previousSibling.classList.remove(styles.down);
      ConfigActions.moveArrayElement({
        path: 'config.declarationTypes',
        index: this.props.index,
        direction: -1
      });
    }, 100);
  }

  moveDown() {
    this.refs.container.nextSibling.classList.add(styles.up);
    this.refs.container.classList.add(styles.down);
    setTimeout(() => {
      this.refs.container.classList.remove(styles.down);
      this.refs.container.nextSibling.classList.remove(styles.up);
      ConfigActions.moveArrayElement({
        path: 'config.declarationTypes',
        index: this.props.index,
        direction: 1
      });
    }, 100);
  }

  nameChanged(evt) {
    ConfigActions.set({
      path: `config.declarationTypes[${this.props.index}].description`,
      value: evt.target.value
    });
  }

  doneEditing() {
    if (this.props.type.description && this.props.type.description.length > 0) {
      ConfigActions.set({
        path: `applicationState.declarationsTypesBeingEdited[${this.props.type.typeCd}]`,
        value: undefined
      });
    }
  }

  startEditing() {
    ConfigActions.set({
      path: `applicationState.declarationsTypesBeingEdited[${this.props.type.typeCd}]`,
      value: {}
    });
  }

  deactivateType() {
    ConfigActions.deactivateType({
      path: 'config.declarationTypes',
      index: this.props.index
    });
  }

  reactivateType() {
    ConfigActions.reactivateType({
      path: 'config.declarationTypes',
      index: this.props.index
    });
  }

  lookForEnter(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      this.doneEditing();
    }
  }

  delete() {
    ConfigActions.removeFromArray({
      path: 'config.declarationTypes',
      index: this.props.index
    });
  }
}
