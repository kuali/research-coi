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

export default class DispositionType extends Type {
  constructor() {
    super();
  }

  typeIsBeingEdited(type) {
    return this.props.applicationState.declarationsTypesBeingEdited[type.typeCd] !== undefined;
  }

  moveUp() {
    ConfigActions.moveArrayElement({
      path: 'config.declarationTypes',
      index: this.props.index,
      direction: -1
    });
  }

  moveDown() {
    ConfigActions.moveArrayElement({
      path: 'config.declarationTypes',
      index: this.props.index,
      direction: 1
    });
  }

  nameChanged(evt) {
    ConfigActions.set({
      path: `config.declarationTypes[${this.props.index}].description`,
      value: evt.target.value
    });
  }

  doneEditing() {
    ConfigActions.set({
      path:`applicationState.declarationsTypesBeingEdited[${this.props.type.typeCd}]`,
      value: undefined
    });
  }

  startEditing() {
    ConfigActions.set({
      path:`applicationState.declarationsTypesBeingEdited[${this.props.type.typeCd}]`,
      value: {}
    });
  }

  deleteType() {
    ConfigActions.removeFromArray({
      path: `config.declarationTypes`,
      index: this.props.index
    });
  }

  lookForEnter(evt) {
    if (evt.keyCode === COIConstants.RETURN_KEY) {
      this.doneEditing();
    }
  }
}
