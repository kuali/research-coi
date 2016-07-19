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
import {schema as personSchema} from './project-person';
import {schema as sponsorSchema} from './project-sponsor';

export const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      minimum: 0
    },
    typeCode: {
      type: 'integer'
    },
    sourceSystem: {
      type: 'string',
      maxLength: 20
    },
    sourceIdentifier: {
      type: 'string',
      maxLength: 50
    },
    sourceStatus: {
      type: 'string',
      maxLength: 75
    },
    persons: {
      type: 'array',
      items: personSchema
    },
    sponsors: {
      type: 'array',
      items: sponsorSchema
    },
    startDate: {
      type: 'string',
      minimum: 0
    },
    endDate: {
      type: 'string',
      minimum: 0
    },
    title: {
      type: 'string',
      maxLength: 2000
    },
    sponsorCode: {
      type: 'string',
      maxLength: 6
    },
    sponsorName: {
      type: 'string',
      maxLength: 200
    }
  },
  required: [
    'typeCode',
    'sourceSystem',
    'sourceIdentifier',
    'sourceStatus',
    'startDate',
    'endDate',
    'title'
  ]
};

const ajv = new Ajv({
  removeAdditional: 'all'
});
const validate = ajv.compile(schema);

export default validate;