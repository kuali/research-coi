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

/* eslint-disable no-magic-numbers, camelcase */

import LoadTest from '../../../../../../../load-test';
import hashCode from '../../../../../../../../hash';
import {getDBConnection} from '../../../../../../../db';
import {ACCEPTED} from './http-status-codes';

export class Test extends LoadTest {
  constructor() {
    super();
    this.CONCURRENT_REQUESTS = 10;
    this.method = 'PUT';

    this.postData = JSON.stringify({
      id: 49,
      projectId: 17,
      finEntityId: 25,
      typeCd: 1,
      comments: '',
      projectTitle: 'Glucose levels in heirloom corn',
      entityName: 'Apple',
      projectTypeCd: 1,
      sponsorName: 'Air Force',
      roleCd: 'PI',
      finEntityActive: 1
    });

    this.id = 0;
    this.alreadyAccessed = true;
  }

  setup(done) {
    const connection = getDBConnection();
    connection.query(`
        SELECT de.id as declaration_id, di.id as disclosure_id, di.user_id
        FROM declaration de, disclosure di
        WHERE de.disclosure_id = di.id`, (err, rows) => {
      if (err) { throw err; }
      this.disclosureMap = {};
      rows.forEach(row => {
        this.disclosureMap[row.user_id] = {
          disclosure_id: row.disclosure_id,
          declaration_id: row.declaration_id
        };
      });

      done();
    });
    connection.end();
  }

  getID() {
    if (this.alreadyAccessed) {
      this.id++;
      if (this.id > 10) {
        this.id = 1;
      }
      this.alreadyAccessed = false;
      return this.id;
    }

    this.alreadyAccessed = true;
    return this.id;
  }

  getPath() {
    const userId = this.getID();
    const record = this.disclosureMap[hashCode(`p${userId}`)];

    return `/api/coi/disclosures/${record.disclosure_id}/declarations/${record.declaration_id}`;
  }

  getHeaders() {
    const id = this.getID();
    return {
      'Authorization': `Bearer p${id}`,
      'Content-Length': this.postData.length,
      'Content-Type': 'application/json'
    };
  }

  isValidResponse(response) {
    return response.statusCode === ACCEPTED;
  }
}
