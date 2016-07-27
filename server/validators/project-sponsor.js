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

import Ajv from 'ajv';

export const schema = {
  type: 'object',
  properties: {
    id: {
      anyOf: [{type: 'integer', minimum: 0}, {type: 'null'}]
    },
    projectId: {
      anyOf: [{type: 'integer', minimum: 0}, {type: 'null'}]
    },
    sourceSystem: {
      type: 'string',
      maxLength: 20
    },
    sourceIdentifier: {
      type: 'string',
      maxLength: 50
    },
    sponsorCode: {
      anyOf: [{type: 'string', maxLength: 6}, {type: 'null'}]
    },
    sponsorName: {
      anyOf: [{type: 'string', maxLength: 200}, {type: 'null'}]
    }
  },
  required: [
    'sourceSystem',
    'sourceIdentifier'
  ]
};

const ajv = new Ajv({
  removeAdditional: 'all'
});
const validate = ajv.compile(schema);

export default validate;