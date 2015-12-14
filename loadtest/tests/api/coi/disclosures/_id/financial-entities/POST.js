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

/* eslint-disable no-magic-numbers */

import LoadTest from '../../../../../../LoadTest';
import hashCode from '../../../../../../../hash';
import {getDBConnection} from '../../../../../../DB';

export class Test extends LoadTest {
  constructor() {
    super();
    this.CONCURRENT_REQUESTS = 10;
    this.method = 'POST';

    this.postData = new Buffer(`\r\n------WebKitFormBoundaryTf0LsICBksypVtu7\r\nContent-Disposition: form-data; name="entity"\r\n\r\n{"active":1,"answers":[{"questionId":7,"answer":{"value":"No"}},{"questionId":6,"answer":{"value":["County Government"]}},{"questionId":8,"answer":{"value":"No"}},{"questionId":9,"answer":{"value":"d"}}],"name":"fsdfs","relationships":[{"personCd":1,"relationshipCd":1,"typeCd":1,"amountCd":1,"comments":"d","travel":{},"id":"TMP1448660628733","amount":"$1 - $5,000","type":"Stock","relationship":"Ownership","person":"Self"}]}\r\n------WebKitFormBoundaryTf0LsICBksypVtu7--`);

    this.id = 0;
    this.alreadyAccessed = true;
  }

  setup(done) {
    let connection = getDBConnection();
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
    let userId = this.getUserID();
    return this.disclosureMap[hashCode(`p${userId}`)];
  }

  getPath() {
    let disclosureId = this.getDisclosureID();
    return `/api/coi/disclosures/${disclosureId}/financial-entities`;
  }

  getHeaders() {
    let id = this.getUserID();
    return {
      'Authorization': `Bearer p${id}`,
      'Content-Length': this.postData.length,
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryTf0LsICBksypVtu7'
    };
  }
}
