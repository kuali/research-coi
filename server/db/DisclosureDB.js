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

export let getReadyForReview = (school, sortColumn, sortDirection) => {
  let results = [{
    disposition: 222,
    id: 34324234,
    name: 'Research 1',
    submittedBy: 'John Jack',
    submittedOn: 1434148767062,
    startDate: 1434148767062,
    status: 'Ready',
    projects: [{
      'name': 'Project 1'
    }]
  }, 
  {
    disposition: 222,
    id: 32432,
    name: 'Research 2',
    submittedBy: 'Kim Kiera',
    submittedOn: 1434948767062,
    startDate: 1434143767062,
    status: 'Open',
    projects: [{
      'name': 'Project 2'
    }]
  }, 
  {
    disposition: 222,
    id: 54364,
    name: 'Research 3',
    submittedBy: 'Lara Lant',
    submittedOn: 1432148767062,
    startDate: 1434448767062,
    status: 'Open',
    projects: [{
      'name': 'Project 3'
    }]
  }, 
  {
    disposition: 222,
    id: 76576,
    name: 'Research 4',
    submittedBy: 'Mark Millburn',
    submittedOn: 1434748767062,
    startDate: 1434188767062,
    status: 'Open',
    projects: [{
      'name': 'Project 4'
    }]
  }, 
  {
    disposition: 222,
    id: 9769,
    name: 'Research 5',
    submittedBy: 'Nate Niter',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'Open',
    projects: [{
      'name': 'Project 5'
    }]
  }, 
  {
    disposition: 222,
    id: 8987,
    name: 'Research 6',
    submittedBy: 'Oliver Osmond',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'Open',
    projects: [{
      'name': 'Project 6'
    }]
  }, 
  {
    disposition: 222,
    id: 113232,
    name: 'Research 7',
    submittedBy: 'Peter Pratan',
    submittedOn: 1434948767062,
    startDate: 1434548767062,
    status: 'Open',
    projects: [{
      'name': 'Project 7'
    }]
  }];

  return results.sort((a, b) => {
    switch (sortColumn) {
      case 'DISPOSITION':
        return sortDirection === 'DESCENDING' ? a.disposition < b.disposition : a.disposition > b.disposition;
      case 'PROJECT_TITLE':
        return sortDirection === 'DESCENDING' ? a.name < b.name : a.name > b.name;
      case 'PI':
        return sortDirection === 'DESCENDING' ? a.submittedBy < b.submittedBy : a.submittedBy > b.submittedBy;
      case 'DATE_SUBMITTED':
        return sortDirection === 'DESCENDING' ? a.submittedOn < b.submittedOn : a.submittedOn > b.submittedOn;
      case 'STATUS':
        return sortDirection === 'DESCENDING' ? a.status < b.status : a.status > b.status;
      case 'PROJECT_START_DATE':
        return sortDirection === 'DESCENDING' ? a.startDate < b.startDate : a.startDate > b.startDate;
    }
  });
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
