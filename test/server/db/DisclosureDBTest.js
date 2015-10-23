/*global describe, it */
import assert from 'assert';
import * as DisclosureDB from '../../../server/db/DisclosureDB';

describe('Disclosure', () => {
  it('expiration date year should equal approval year when approval month day is before expiration month day', () => {
    let expirationDate = DisclosureDB.getExpirationDate(new Date(2015, 3, 1), false, new Date(2001, 6, 31));
    assert.equal(expirationDate.toDateString(), new Date(2015, 6, 31).toDateString());
  });

  it('expiration date year should be approval year plus 1 when approval month day is after expiration month day', () => {
    let expirationDate = DisclosureDB.getExpirationDate(new Date(2015, 8, 1), false, new Date(2001, 6, 31));
    assert.equal(expirationDate.toDateString(), new Date(2016, 6, 31).toDateString());
  });

  it('expiration date year should be approval year plus 1 when rolling date is true', () => {
    let expirationDate = DisclosureDB.getExpirationDate(new Date(2015, 8, 1), true);
    assert.equal(expirationDate.toDateString(), new Date(2016, 8, 1).toDateString());
  });

});
