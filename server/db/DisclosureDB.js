let mockDB = new Map();
let lastId = 0;

export let wipeAll = () => {
  mockDB.clear();
};

export let save = (school, newDisclosure) => {
  if (!mockDB.has(school)) {
    mockDB.set(school, new Map());
  }
  mockDB.get(school).set(lastId, newDisclosure);
  return lastId++;
};

export let saveExisting = (school, disclosureId, newDisclosure) => {
  if (mockDB.has(school) && mockDB.get(school).has(disclosureId)) {
    mockDB.get(school).set(disclosureId, newDisclosure);
  }
};

export let get = (school, disclosureId) => {
  if (mockDB.has(school) && mockDB.get(school).has(+disclosureId)) {
    return mockDB.get(school).get(+disclosureId);
  }
  return undefined;
};

export let approve = (school, disclosureId) => {
  let disclosure = get(school, disclosureId);
  disclosure.status = 'APPROVED';
};

export let sendBack = (school, disclosureId) => {
  let disclosure = get(school, disclosureId);
  disclosure.status = 'RETURNED';
};

export let addReviewer = (school, disclosureId, reviewerName) => {
  let disclosure = get(school, disclosureId);
  if (!disclosure.reviewers) disclosure.reviewers = [];
  disclosure.reviewers.push(reviewerName);
};

export let addQuestionnaireComment = (school, disclosureId, comment) => {
  let disclosure = get(school, disclosureId);
  if (!disclosure.questionnaire) disclosure.questionnaire = {comments: []};
  disclosure.questionnaire.comments.push(comment);
};

export let addEntityComment = (school, disclosureId, comment) => {
  let disclosure = get(school, disclosureId);
  if (!disclosure.entity) disclosure.entity = {comments: []};
  disclosure.entity.comments.push(comment);
};

export let addDeclarationComment = (school, disclosureId, comment) => {
  let disclosure = get(school, disclosureId);
  if (!disclosure.declarations) disclosure.declarations = {comments: []};
  disclosure.declarations.comments.push(comment);
};

export let searchByDate = (school, start, end) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.submittedDate >= start && value.submittedDate <= end) {
      matches.push(value);
    }
  });

  return matches;
};

export let searchByType = (school, type) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.type === type) {
      matches.push(value);
    }
  });

  return matches;
};

export let searchByDisposition = (school, disposition) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.disposition === disposition) {
      matches.push(value);
    }
  });

  return matches;
};

export let searchByStatus = (school, status) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.status === status) {
      matches.push(value);
    }
  });

  return matches;
};

export let searchByUnit = (school, unit) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.unit === unit) {
      matches.push(value);
    }
  });

  return matches;
};

export let search = (school, query) => {
  let schoolMap = mockDB.get(school);
  let matches = [];
  schoolMap.forEach((value) => {
    if (value.name.startsWith(query)) {
      matches.push(value);
    }
  });

  return matches;
};
