module.exports = {
  'Submit an annual disclosure' : function (browser) {
    browser
      .url(process.env.FUNCTIONAL_TEST_URL)
      .setValue('input[type=text]', process.env.FUNCTIONAL_USER)
      .setValue('input[type=password]', 'password')
      .click("button[value='Sign In']")
      .waitAndClick("a[href='/coi/disclosure?type=2']", 10000)
      .waitAndClick("#multi_No_1")
      .waitAndClick("#multi_No_2")
      .waitAndClick("#multi_No_3")
      .waitAndClick("#multi_No_4")
      .waitAndClick("#nextStep")
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
  }
};