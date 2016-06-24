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

import LoadTest from '../../../../../../load-test';
import hashCode from '../../../../../../../hash';
import {getDBConnection} from '../../../../../../db';

export class Test extends LoadTest {
  constructor(config) {
    super(config);

    this.disabled = true;

    this.CONCURRENT_REQUESTS = 10;
    this.method = 'POST';

    this.postData = JSON.stringify({
      questionId: 2,
      answer: {
        value: 'No'
      }
    });

    this.id = 0;
    this.alreadyAccessed = true;
  }

  setup(done) {
    const connection = getDBConnection();
    connection.query(`
        SELECT user_id, id as disclosure_id
        FROM disclosure
        WHERE id < 11`, (err, rows) => {
      if (err) { throw err; }
      this.disclosureMap = {};
      rows.forEach(disclosure => {
        this.disclosureMap[disclosure.user_id] = disclosure.disclosure_id;
      });

      done();
    });
    connection.end();
  }

  getUserID() {
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

  getDisclosureID() {
    const userId = this.getUserID();
    return this.disclosureMap[hashCode(`p${userId}`)];
  }

  getPath() {
    const disclosureId = this.getDisclosureID();
    return `/api/coi/disclosures/${disclosureId}/question-answers`;
  }

  getHeaders() {
    const headers = this.headers;
    headers['Content-Length'] = this.postData.length;
    headers['Content-Type'] = 'application/json';

    return headers;
  }
}
