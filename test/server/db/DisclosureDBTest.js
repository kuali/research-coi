/*global describe, beforeEach, it */
import assert from 'assert';
import * as DisclosureDB from '../../../server/db/DisclosureDB';

describe('Disclosure', () => {
  beforeEach(() => {
    DisclosureDB.wipeAll();
  });

  it('should return an id when saving a brand new disclosure', () => {
    let newId = DisclosureDB.save('UIT', {
      fakeDisclosure: true
    });
    assert(Number.isInteger(newId));
  });

  it('should save and retrieve a disclosure for the given school', () => {
    let newId = DisclosureDB.save('UIT', {
      fakeDisclosure: true,
      color: 'blue'
    });
    let theDisclosure = DisclosureDB.get('UIT', newId);
    assert.equal(theDisclosure.fakeDisclosure, true);
    assert.equal(theDisclosure.color, 'blue');
  });

  it('should replace an existing disclosure with the given school and id', () => {
    let theId = DisclosureDB.save('UIT', {
      fakeDisclosure: true,
      color: 'red'
    });

    DisclosureDB.saveExisting('UIT', theId, {
      fakeDisclosure: true,
      color: 'green'
    });

    let theDisclosure = DisclosureDB.get('UIT', theId);
    assert.equal(theDisclosure.color, 'green');
  });

  it('should return undefined for invalid parameters', () => {
    let response = DisclosureDB.get('UIT', 9999999999999999);
    assert.equal(response, undefined);

    response = DisclosureDB.get('Monsters U', 0);
    assert.equal(response, undefined);
  });

  it('should not return another schools disclosure when using the same id', () => {
    let UITid = DisclosureDB.save('UIT', {
      fakeDisclosure: true,
      color: 'purple'
    });

    let response = DisclosureDB.get('UtSU', UITid);
    assert.equal(response, undefined);
  });

  it('should approve the disclosure with the given school and id', () => {
    let id = DisclosureDB.save('UIT', {
      fakeDisclosure: true,
      color: 'lime'
    });
    assert.doesNotThrow(() => {
      DisclosureDB.approve('UIT', id);
    });
    let theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.status, 'APPROVED'); // Implementation detail will change
  });

  it('should fail approving the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      DisclosureDB.approve('UIT', 999999999999999);
    });
    assert.throws(() => {
      DisclosureDB.approve('FROG', 33);
    });
  });

  it('should send back the disclosure with the given school and id', () => {
    let id = DisclosureDB.save('UIT', {
      fakeDisclosure: true,
      color: 'navy'
    });
    assert.doesNotThrow(() => {
      DisclosureDB.sendBack('UIT', id);
    });
    let theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.status, 'RETURNED'); // Implementation detail will change
  });

  it('should fail sending back the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      DisclosureDB.sendBack('UIT', 999999999999999);
    });
    assert.throws(() => {
      DisclosureDB.sendBack('FROG', 33);
    });
  });

  it('should add a reviewer to the disclosure with the given school and id', () => {
    let id = DisclosureDB.save('UIT', {
      fakeDisclosure: true,
      color: 'azul'
    });
    assert.doesNotThrow(() => {
      DisclosureDB.addReviewer('UIT', id, 'Geraldo');
    });
    let theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.reviewers.length, 1); // Implementation detail will change
    assert.equal(theDisclosure.reviewers[0], 'Geraldo'); // Implementation detail will change

    assert.doesNotThrow(() => {
      DisclosureDB.addReviewer('UIT', id, 'Phil');
    });
    theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.reviewers.length, 2); // Implementation detail will change
    assert.equal(theDisclosure.reviewers[0], 'Geraldo'); // Implementation detail will change
    assert.equal(theDisclosure.reviewers[1], 'Phil'); // Implementation detail will change
  });

  it('should fail adding a reviewer to the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      DisclosureDB.addReviewer('UIT', 999999999999999, 'Geraldo');
    });
    assert.throws(() => {
      DisclosureDB.addReviewer('FROG', 33, 'Geraldo');
    });
  });

  it('should add a questionnaire comment to the disclosure with the given school and id', () => {
    let id = DisclosureDB.save('UIT', {
      fakeDisclosure: true,
      color: 'forest'
    });
    assert.doesNotThrow(() => {
      DisclosureDB.addQuestionnaireComment('UIT', id, 'You did a good job!');
    });
    let theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.questionnaire.comments.length, 1); // Implementation detail will change
    assert.equal(theDisclosure.questionnaire.comments[0], 'You did a good job!'); // Implementation detail will change

    assert.doesNotThrow(() => {
      DisclosureDB.addQuestionnaireComment('UIT', id, 'Try again!');
    });
    theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.questionnaire.comments.length, 2); // Implementation detail will change
    assert.equal(theDisclosure.questionnaire.comments[0], 'You did a good job!'); // Implementation detail will change
    assert.equal(theDisclosure.questionnaire.comments[1], 'Try again!'); // Implementation detail will change
  });

  it('should fail adding a questionnaire comment to the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      DisclosureDB.addQuestionnaireComment('UIT', 999999999999999, 'Ding');
    });
    assert.throws(() => {
      DisclosureDB.addQuestionnaireComment('FROG', 33, 'Ding');
    });
  });

  it('should add an entity comment to the disclosure with the given school and id', () => {
    let id = DisclosureDB.save('UIT', {
      fakeDisclosure: true,
      color: 'plum'
    });
    assert.doesNotThrow(() => {
      DisclosureDB.addEntityComment('UIT', id, 'You did a good job!');
    });
    let theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.entity.comments.length, 1); // Implementation detail will change
    assert.equal(theDisclosure.entity.comments[0], 'You did a good job!'); // Implementation detail will change

    assert.doesNotThrow(() => {
      DisclosureDB.addEntityComment('UIT', id, 'Try again!');
    });
    theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.entity.comments.length, 2); // Implementation detail will change
    assert.equal(theDisclosure.entity.comments[0], 'You did a good job!'); // Implementation detail will change
    assert.equal(theDisclosure.entity.comments[1], 'Try again!'); // Implementation detail will change
  });

  it('should fail adding an entity comment to the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      DisclosureDB.addEntityComment('UIT', 999999999999999, 'Ding');
    });
    assert.throws(() => {
      DisclosureDB.addEntityComment('FROG', 33, 'Ding');
    });
  });

  it('should add a declaration comment to the disclosure with the given school and id', () => {
    let id = DisclosureDB.save('UIT', {
      fakeDisclosure: true,
      color: 'salmon'
    });
    assert.doesNotThrow(() => {
      DisclosureDB.addDeclarationComment('UIT', id, 'You did a good job!');
    });
    let theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.declarations.comments.length, 1); // Implementation detail will change
    assert.equal(theDisclosure.declarations.comments[0], 'You did a good job!'); // Implementation detail will change

    assert.doesNotThrow(() => {
      DisclosureDB.addDeclarationComment('UIT', id, 'Try again!');
    });
    theDisclosure = DisclosureDB.get('UIT', id);
    assert.equal(theDisclosure.declarations.comments.length, 2); // Implementation detail will change
    assert.equal(theDisclosure.declarations.comments[0], 'You did a good job!'); // Implementation detail will change
    assert.equal(theDisclosure.declarations.comments[1], 'Try again!'); // Implementation detail will change
  });

  it('should fail adding a declaration comment to the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      DisclosureDB.addDeclarationComment('UIT', 999999999999999, 'Ding');
    });
    assert.throws(() => {
      DisclosureDB.addDeclarationComment('FROG', 33, 'Ding');
    });
  });

  it('should return the right disclosure when searching by date', () => {
    DisclosureDB.save('UIT', {submittedDate: 1425193200000});
    DisclosureDB.save('UIT', {submittedDate: 1434780000000});
    DisclosureDB.save('UIT', {submittedDate: 1455433200000});

    let startSearch = 1429423200000;
    let endSearch = 1446271200000;

    let results = DisclosureDB.searchByDate('UIT', startSearch, endSearch);
    assert.equal(results.length, 1);
    assert.equal(results[0].submittedDate, 1434780000000);
  });

  it('should return the right disclosure when searching by type', () => {
    DisclosureDB.save('UIT', {type: 'Annual'});
    DisclosureDB.save('UIT', {type: 'Travel'});
    DisclosureDB.save('UIT', {type: 'Travel', version: 2});
    DisclosureDB.save('UIT', {type: 'Manual'});

    let results = DisclosureDB.searchByType('UIT', 'Annual');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'Annual');

    results = DisclosureDB.searchByType('UIT', 'Travel');
    assert.equal(results.length, 2);
    assert.equal(results[0].type, 'Travel');
    assert.equal(results[1].type, 'Travel');

    results = DisclosureDB.searchByType('UIT', 'Manual');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'Manual');
  });

  it('should return the right disclosure when searching by disposition', () => {
    DisclosureDB.save('UIT', {disposition: 'No Conflict'});
    DisclosureDB.save('UIT', {disposition: 'Potential Conflict'});
    DisclosureDB.save('UIT', {disposition: 'Potential Conflict', version: 2});
    DisclosureDB.save('UIT', {disposition: 'Managed Conflict'});

    let results = DisclosureDB.searchByDisposition('UIT', 'No Conflict');
    assert.equal(results.length, 1);
    assert.equal(results[0].disposition, 'No Conflict');

    results = DisclosureDB.searchByDisposition('UIT', 'Potential Conflict');
    assert.equal(results.length, 2);
    assert.equal(results[0].disposition, 'Potential Conflict');
    assert.equal(results[1].disposition, 'Potential Conflict');

    results = DisclosureDB.searchByDisposition('UIT', 'Managed Conflict');
    assert.equal(results.length, 1);
    assert.equal(results[0].disposition, 'Managed Conflict');
  });

  it('should return the right disclosure when searching by status', () => {
    DisclosureDB.save('UIT', {status: 'Active'});
    DisclosureDB.save('UIT', {status: 'Returned'});
    DisclosureDB.save('UIT', {status: 'Denied', version: 2});

    let results = DisclosureDB.searchByStatus('UIT', 'Denied');
    assert.equal(results.length, 1);
    assert.equal(results[0].status, 'Denied');
  });

  it('should return the right disclosure when searching by unit', () => {
    DisclosureDB.save('UIT', {unit: 'CS'});
    DisclosureDB.save('UIT', {unit: 'MATH'});
    DisclosureDB.save('UIT', {unit: 'PHYS', version: 2});

    let results = DisclosureDB.searchByUnit('UIT', 'MATH');
    assert.equal(results.length, 1);
    assert.equal(results[0].unit, 'MATH');
  });

  it('should return the right disclosure when searching by free form text', () => {
    DisclosureDB.save('UIT', {unit: 'CS', name: 'Johnny Lingo'});
    DisclosureDB.save('UIT', {unit: 'MATH', name: 'Dan Trap'});
    DisclosureDB.save('UIT', {unit: 'PHYS', name: 'Morgan Tark', version: 2});

    let results = DisclosureDB.search('UIT', 'Morgan');
    assert.equal(results.length, 1);
    assert.equal(results[0].name, 'Morgan Tark');
  });

  it('should return no disclosures when searching by crazy parameters', () => {
    DisclosureDB.save('UIT', {unit: 'CS', name: 'Johnny Lingo'});
    DisclosureDB.save('UIT', {unit: 'MATH', name: 'Dan Trap'});
    DisclosureDB.save('UIT', {unit: 'PHYS', name: 'Morgan Tark', version: 2});

    let results = DisclosureDB.search('UIT', 'Youtube');
    assert.equal(results.length, 0);
  });
});
