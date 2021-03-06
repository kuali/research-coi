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

import ConfigActions from './actions/config-actions';

export default function getConfig(state, id) {
  if (state.config.id === id) {
    return state.config;
  } else if (state.archivedConfigs[id] !== undefined) {
    return state.archivedConfigs[id];
  }

  setTimeout(() => {
    ConfigActions.loadConfig(id);
  }, 0);
  return null;
}
