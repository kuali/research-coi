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

/* eslint-disable object-shorthand, quotes */

module.exports = {
  'Submit an annual disclosure' : function (browser) {
    browser
      .url(process.env.FUNCTIONAL_TEST_URL)
      .setValue('input[type=text]', process.env.FUNCTIONAL_USER)
      .setValue('input[type=password]', 'password')
      .click("button[value='Sign In']")
      .waitAndClick("a[href='/coi/disclosure?type=2']", 10000)
      .waitAndClick('#multi_No_1')
      .waitAndClick('#multi_No_2')
      .waitAndClick('#multi_No_3')
      .waitAndClick('#multi_No_4')
      .waitAndClick('#nextStep')
      .waitAndClick('#newEntityButton')
      .setValue('input','blah blah ')
      .waitAndClick('#nextButton')
      .waitAndClick("input[value='State Government']")
      .waitAndClick('#multi_Yes_7')
      .waitAndClick('#multi_Yes_8')
      .setValue('textarea', 'blah')
      .waitAndClick('#nextButton')
      .select('#personType')
      .waitAndClick('button[name=Ownership]')
      .select('#relationType')
      .select('#amountType')
      .setValue('textarea', 'blah')
      .waitAndClick('#addAdditionalRelationship')
      .waitAndClick('#submitButton')
      .waitAndClick('#nextStep')
      .waitAndClick('#certCheckbox')
      .waitAndClick('#submit')
      .end();
  },

  'user can not view admin page' : function (browser) {
    browser
      .url(`${process.env.FUNCTIONAL_TEST_URL}/admin`)
      .setValue('input[type=text]', 'cate')
      .setValue('input[type=password]', 'password')
      .click("button[value='Sign In']")
      .waitForElementVisible("#unauthorized", 5000)
      .assert.containsText("div", "UNAUTHORIZED")
      .end();
  },

  'user can not access config' : function (browser) {
    browser
      .url(`${process.env.FUNCTIONAL_TEST_URL}/config`)
      .setValue('input[type=text]', 'cate')
      .setValue('input[type=password]', 'password')
      .click("button[value='Sign In']")
      .waitForElementVisible("#unauthorized", 5000)
      .assert.containsText("div", "UNAUTHORIZED")
      .end();
  },

  'reviewer can not access config' : function (browser) {
    browser
      .url(`${process.env.FUNCTIONAL_TEST_URL}/config`)
      .setValue('input[type=text]', 'coireviewer')
      .setValue('input[type=password]', 'password')
      .click("button[value='Sign In']")
      .waitForElementVisible("#unauthorized", 5000)
      .assert.containsText("div", "UNAUTHORIZED")
      .end();
  }
};
