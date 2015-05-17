import assert from 'assert';
import * as Disclosure from '../../../server/db/disclosure';

describe('Disclosure',() => {
  beforeEach(() => {
    Disclosure.wipeAll();
  });

  it('should return an id when saving a brand new disclosure', () => {
    let newId = Disclosure.save('UIT', {
      fakeDisclosure: true
    });
    assert(Number.isInteger(newId));
  });

  it('should save and retrieve a disclosure for the given school', () => {
    let newId = Disclosure.save('UIT', {
      fakeDisclosure: true,
      color: 'blue'
    });
    let theDisclosure = Disclosure.get('UIT', newId);
    assert.equal(theDisclosure.fakeDisclosure, true);
    assert.equal(theDisclosure.color, 'blue');
  });

  it('should replace an existing disclosure with the given school and id', () => {
    let theId = Disclosure.save('UIT', {
      fakeDisclosure: true,
      color: 'red'
    });

    Disclosure.saveExisting('UIT', theId, {
      fakeDisclosure: true,
      color: 'green'
    });

    let theDisclosure = Disclosure.get('UIT', theId);
    assert.equal(theDisclosure.color, 'green');
  });

  it('should return undefined for invalid parameters', () => {
    let response = Disclosure.get('UIT', 9999999999999999);
    assert.equal(response, undefined);

    response = Disclosure.get('Monsters U', 0);
    assert.equal(response, undefined);
  });

  it('should not return another schools disclosure when using the same id', () => {
    let UITid = Disclosure.save('UIT', {
      fakeDisclosure: true,
      color: 'purple'
    });

    let response = Disclosure.get('UtSU', UITid);
    assert.equal(response, undefined);
  });

  it('should approve the disclosure with the given school and id', () => {
    let id = Disclosure.save('UIT', {
      fakeDisclosure: true,
      color: 'lime'
    });
    assert.doesNotThrow(() => {
      Disclosure.approve('UIT', id);
    });
    let theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.status, 'APPROVED'); // Implementation detail will change
  });

  it('should fail approving the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      Disclosure.approve('UIT', 999999999999999);
    });
    assert.throws(() => {
      Disclosure.approve('FROG', 33);
    });
  });

  it('should send back the disclosure with the given school and id', () => {
    let id = Disclosure.save('UIT', {
      fakeDisclosure: true,
      color: 'navy'
    });
    assert.doesNotThrow(() => {
      Disclosure.sendBack('UIT', id);
    });
    let theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.status, 'RETURNED'); // Implementation detail will change
  });

  it('should fail sending back the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      Disclosure.sendBack('UIT', 999999999999999);
    });
    assert.throws(() => {
      Disclosure.sendBack('FROG', 33);
    });
  });

  it('should add a reviewer to the disclosure with the given school and id', () => {
    let id = Disclosure.save('UIT', {
      fakeDisclosure: true,
      color: 'azul'
    });
    assert.doesNotThrow(() => {
      Disclosure.addReviewer('UIT', id, 'Geraldo');
    });
    let theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.reviewers.length, 1); // Implementation detail will change
    assert.equal(theDisclosure.reviewers[0], 'Geraldo'); // Implementation detail will change

    assert.doesNotThrow(() => {
      Disclosure.addReviewer('UIT', id, 'Phil');
    });
    theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.reviewers.length, 2); // Implementation detail will change
    assert.equal(theDisclosure.reviewers[0], 'Geraldo'); // Implementation detail will change
    assert.equal(theDisclosure.reviewers[1], 'Phil'); // Implementation detail will change
  });

  it('should fail adding a reviewer to the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      Disclosure.addReviewer('UIT', 999999999999999, 'Geraldo');
    });
    assert.throws(() => {
      Disclosure.addReviewer('FROG', 33, 'Geraldo');
    });
  });

  it('should add a questionnaire comment to the disclosure with the given school and id', () => {
    let id = Disclosure.save('UIT', {
      fakeDisclosure: true,
      color: 'forest'
    });
    assert.doesNotThrow(() => {
      Disclosure.addQuestionnaireComment('UIT', id, 'You did a good job!');
    });
    let theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.questionnaire.comments.length, 1); // Implementation detail will change
    assert.equal(theDisclosure.questionnaire.comments[0], 'You did a good job!'); // Implementation detail will change

    assert.doesNotThrow(() => {
      Disclosure.addQuestionnaireComment('UIT', id, 'Try again!');
    });
    theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.questionnaire.comments.length, 2); // Implementation detail will change
    assert.equal(theDisclosure.questionnaire.comments[0], 'You did a good job!'); // Implementation detail will change
    assert.equal(theDisclosure.questionnaire.comments[1], 'Try again!'); // Implementation detail will change
  });

  it('should fail adding a questionnaire comment to the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      Disclosure.addQuestionnaireComment('UIT', 999999999999999, 'Ding');
    });
    assert.throws(() => {
      Disclosure.addQuestionnaireComment('FROG', 33, 'Ding');
    });
  });

  it('should add an entity comment to the disclosure with the given school and id', () => {
    let id = Disclosure.save('UIT', {
      fakeDisclosure: true,
      color: 'plum'
    });
    assert.doesNotThrow(() => {
      Disclosure.addEntityComment('UIT', id, 'You did a good job!');
    });
    let theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.entity.comments.length, 1); // Implementation detail will change
    assert.equal(theDisclosure.entity.comments[0], 'You did a good job!'); // Implementation detail will change

    assert.doesNotThrow(() => {
      Disclosure.addEntityComment('UIT', id, 'Try again!');
    });
    theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.entity.comments.length, 2); // Implementation detail will change
    assert.equal(theDisclosure.entity.comments[0], 'You did a good job!'); // Implementation detail will change
    assert.equal(theDisclosure.entity.comments[1], 'Try again!'); // Implementation detail will change
  });

  it('should fail adding an entity comment to the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      Disclosure.addEntityComment('UIT', 999999999999999, 'Ding');
    });
    assert.throws(() => {
      Disclosure.addEntityComment('FROG', 33, 'Ding');
    });
  });

  it('should add a declaration comment to the disclosure with the given school and id', () => {
    let id = Disclosure.save('UIT', {
      fakeDisclosure: true,
      color: 'salmon'
    });
    assert.doesNotThrow(() => {
      Disclosure.addDeclarationComment('UIT', id, 'You did a good job!');
    });
    let theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.declarations.comments.length, 1); // Implementation detail will change
    assert.equal(theDisclosure.declarations.comments[0], 'You did a good job!'); // Implementation detail will change

    assert.doesNotThrow(() => {
      Disclosure.addDeclarationComment('UIT', id, 'Try again!');
    });
    theDisclosure = Disclosure.get('UIT', id);
    assert.equal(theDisclosure.declarations.comments.length, 2); // Implementation detail will change
    assert.equal(theDisclosure.declarations.comments[0], 'You did a good job!'); // Implementation detail will change
    assert.equal(theDisclosure.declarations.comments[1], 'Try again!'); // Implementation detail will change
  });

  it('should fail adding a declaration comment to the disclosure if it doesnt exist', () => {
    assert.throws(() => {
      Disclosure.addDeclarationComment('UIT', 999999999999999, 'Ding');
    });
    assert.throws(() => {
      Disclosure.addDeclarationComment('FROG', 33, 'Ding');
    });
  });

  it('should return the right disclosure when searching by date', () => {
    Disclosure.save('UIT', {submittedDate: 1425193200000});
    Disclosure.save('UIT', {submittedDate: 1434780000000});
    Disclosure.save('UIT', {submittedDate: 1455433200000});

    let startSearch = 1429423200000;
    let endSearch = 1446271200000;

    let results = Disclosure.searchByDate('UIT', startSearch, endSearch);
    assert.equal(results.length, 1);
    assert.equal(results[0].submittedDate, 1434780000000);
  });

  it('should return the right disclosure when searching by type', () => {
    Disclosure.save('UIT', {type: 'Annual'});
    Disclosure.save('UIT', {type: 'Travel'});
    Disclosure.save('UIT', {type: 'Travel', version: 2});
    Disclosure.save('UIT', {type: 'Manual'});

    let results = Disclosure.searchByType('UIT', 'Annual');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'Annual');

    results = Disclosure.searchByType('UIT', 'Travel');
    assert.equal(results.length, 2);
    assert.equal(results[0].type, 'Travel');
    assert.equal(results[1].type, 'Travel');

    results = Disclosure.searchByType('UIT', 'Manual');
    assert.equal(results.length, 1);
    assert.equal(results[0].type, 'Manual');
  });

  it('should return the right disclosure when searching by disposition', () => {
    Disclosure.save('UIT', {disposition: 'No Conflict'});
    Disclosure.save('UIT', {disposition: 'Potential Conflict'});
    Disclosure.save('UIT', {disposition: 'Potential Conflict', version: 2});
    Disclosure.save('UIT', {disposition: 'Managed Conflict'});

    let results = Disclosure.searchByDisposition('UIT', 'No Conflict');
    assert.equal(results.length, 1);
    assert.equal(results[0].disposition, 'No Conflict');

    results = Disclosure.searchByDisposition('UIT', 'Potential Conflict');
    assert.equal(results.length, 2);
    assert.equal(results[0].disposition, 'Potential Conflict');
    assert.equal(results[1].disposition, 'Potential Conflict');

    results = Disclosure.searchByDisposition('UIT', 'Managed Conflict');
    assert.equal(results.length, 1);
    assert.equal(results[0].disposition, 'Managed Conflict');
  });

  it('should return the right disclosure when searching by status', () => {
    Disclosure.save('UIT', {status: 'Active'});
    Disclosure.save('UIT', {status: 'Returned'});
    Disclosure.save('UIT', {status: 'Denied', version: 2});

    let results = Disclosure.searchByStatus('UIT', 'Denied');
    assert.equal(results.length, 1);
    assert.equal(results[0].status, 'Denied');
  });

  it('should return the right disclosure when searching by unit', () => {
    Disclosure.save('UIT', {unit: 'CS'});
    Disclosure.save('UIT', {unit: 'MATH'});
    Disclosure.save('UIT', {unit: 'PHYS', version: 2});

    let results = Disclosure.searchByUnit('UIT', 'MATH');
    assert.equal(results.length, 1);
    assert.equal(results[0].unit, 'MATH');
  });

  it('should return the right disclosure when searching by free form text', () => {
    Disclosure.save('UIT', {unit: 'CS', name: 'Johnny Lingo'});
    Disclosure.save('UIT', {unit: 'MATH', name: 'Dan Trap'});
    Disclosure.save('UIT', {unit: 'PHYS', name: 'Morgan Tark', version: 2});

    let results = Disclosure.search('UIT', 'Morgan');
    assert.equal(results.length, 1);
    assert.equal(results[0].name, 'Morgan Tark');
  });

  it('should return no disclosures when searching by crazy parameters', () => {
    Disclosure.save('UIT', {unit: 'CS', name: 'Johnny Lingo'});
    Disclosure.save('UIT', {unit: 'MATH', name: 'Dan Trap'});
    Disclosure.save('UIT', {unit: 'PHYS', name: 'Morgan Tark', version: 2});

    let results = Disclosure.search('UIT', 'Youtube');
    assert.equal(results.length, 0);
  });
});