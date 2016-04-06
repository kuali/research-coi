const DEFAULT_TIMEOUT = 5000;

let getKnex;
try {
  const extensions = require('research-extensions').default;
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('../server/db/connection-manager').default;
}
const knex = getKnex({});

function logIn(browser, username, password, authHost) {
  return browser
    .url(authHost)
    .setValue('input[type=text]', username)
    .setValue('input[type=password]', password)
    .click("button[value='Sign In']")
}

function waitAndClick(browser, selector, timeout) {
  if (!timeout) {
    timeout = DEFAULT_TIMEOUT;
  }

  return browser.waitForElementVisible(selector, timeout)
    .click(selector)
}

function select(browser, selector, value) {
  return browser.click(selector)
    .pause(500)
    .click(value)
    .keys(['\uE006']);
}

module.exports = {
  'Submit an annual disclosure' : function (browser) {
    logIn(browser, 'cate', 'password', process.env.FUNCTIONAL_TEST_URL);
    waitAndClick(browser, "a[href='/coi/disclosure?type=2']", 10000);
    waitAndClick(browser, "input[id=multi_No_1]");
    waitAndClick(browser, "input[id=multi_No_2]");
    waitAndClick(browser, "input[id=multi_No_3]");
    waitAndClick(browser, "input[id=multi_No_4]");
    waitAndClick(browser, "#nextStep");
    waitAndClick(browser, '#newEntityButton');
    browser.setValue('input','blah blah ');
    waitAndClick(browser, '#nextButton');
    waitAndClick(browser, "input[value='State Government']");
    waitAndClick(browser, '#multi_Yes_7');
    waitAndClick(browser, '#multi_Yes_8');
    browser.setValue('textarea', 'blah');
    waitAndClick(browser, '#nextButton');
    select(browser, '#personType', '#person_type_option_1');
    waitAndClick(browser, 'button[name=Ownership]');
    select(browser, '#relationType', '#type_option_1');
    select(browser, '#amountType', '#amount_option_1');
    browser.setValue('textarea', 'blah');
    waitAndClick(browser, '#addAdditionalRelationship');
    waitAndClick(browser, '#submitButton');
    waitAndClick(browser, '#nextStep');
    waitAndClick(browser, '#certCheckbox');
    waitAndClick(browser, '#submit');
    browser.end()
  },

  'after' : async function(browser, done) {
    await knex('state').del();
    await knex('relationship').del();
    await knex('disclosure_answer ').del();
    await knex('fin_entity_answer').del();
    await knex('fin_entity').del();
    await knex('disclosure').del();
    knex.destroy();
    done()
  }
};