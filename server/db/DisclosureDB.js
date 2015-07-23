import mysql from 'mysql';
import {ConnectionManager} from './ConnectionManager';

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
  
  let disclosures = getSampleDisclosures();
  let selectedDisclosure;
  disclosures.forEach((disclosure) => {
    if (disclosureId == disclosure.id) {
      selectedDisclosure = disclosure;
    }
  });
  return selectedDisclosure;
};

// this need not be implemented, just demo data for now
// until get by disclosure id is implemented.
export let getSampleDisclosures = () => {
let results = [{
    type: 'ANNUAL',
    disposition: 222,
    id: 34324234,
    name: 'Research 1',
    submittedBy: 'John Jack',
    submittedOn: 1434148767062,
    startDate: 1434148767062,
    status: 'IN_PROGRESS',
    questionnaire:{
      "1":"Yes",
      "2":"No",
      "3":"Yes"
     },
    entities:[
      {
        "id":61709,
        "name":"Avaya Inc.",
        "status":"Active",
        "public":true,
        "type":"Large Corporation",
        "sponsorResearch":false,
        "description":"A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS",
        "relationships":[
          {
            "person":"Self",
            "relationship":"Other",
            "type":"Other Transactions",
            "amount":"$1-$5,000",
            "comments":"This organization consults with me weekly via phone"
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 1'
    }]
  }, 
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 32432,
    name: 'Research 2',
    submittedBy: 'Kim Kiera',
    submittedOn: 1434948767062,
    startDate: 1434143767062,
    status: 'AWAITING_REVIEW',
    questionnaire:{
      "1":"Yes",
      "2":"No",
      "3":"Yes"
     },
    entities:[
      {
        "id":61709,
        "name":"Avaya Inc.",
        "status":"Active",
        "public":true,
        "type":"Large Corporation",
        "sponsorResearch":false,
        "description":"A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS",
        "relationships":[
          {
            "person":"Self",
            "relationship":"Other",
            "type":"Other Transactions",
            "amount":"$1-$5,000",
            "comments":"This organization consults with me weekly via phone"
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 2'
    }]
  }, 
  {
    type: 'PROJECT',
    disposition: 222,
    id: 54364,
    name: 'Research 3',
    submittedBy: 'Lara Lant',
    submittedOn: 1432148767062,
    startDate: 1434448767062,
    status: 'IN_PROGRESS',
    questionnaire:{
      "1":"Yes",
      "2":"No",
      "3":"Yes"
     },
    entities:[
      {
        "id":61709,
        "name":"Avaya Inc.",
        "status":"Active",
        "public":true,
        "type":"Large Corporation",
        "sponsorResearch":false,
        "description":"A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS",
        "relationships":[
          {
            "person":"Self",
            "relationship":"Other",
            "type":"Other Transactions",
            "amount":"$1-$5,000",
            "comments":"This organization consults with me weekly via phone"
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 3'
    }]
  }, 
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 76576,
    name: 'Research 4',
    submittedBy: 'Mark Millburn',
    submittedOn: 1434748767062,
    startDate: 1434188767062,
    status: 'REVISION_NECESSARY',
    "questionnaire":{
      "1":"Yes",
      "2":"No",
      "3":"Yes"
     },
    "entities":[
      {
        "id":61709,
        "name":"Avaya Inc.",
        "status":"Active",
        "public":true,
        "type":"Large Corporation",
        "sponsorResearch":false,
        "description":"A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS",
        "relationships":[
          {
            "person":"Self",
            "relationship":"Other",
            "type":"Other Transactions",
            "amount":"$1-$5,000",
            "comments":"This organization consults with me weekly via phone"
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 4'
    }]
  }, 
  {
    type: 'PROJECT',
    disposition: 222,
    id: 9769,
    name: 'Research 5',
    submittedBy: 'Nate Niter',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'REVISION_NECESSARY',
    "questionnaire":{
      "1":"Yes",
      "2":"No",
      "3":"Yes"
     },
    "entities":[
      {
        "id":61709,
        "name":"Avaya Inc.",
        "status":"Active",
        "public":true,
        "type":"Large Corporation",
        "sponsorResearch":false,
        "description":"A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS",
        "relationships":[
          {
            "person":"Self",
            "relationship":"Other",
            "type":"Other Transactions",
            "amount":"$1-$5,000",
            "comments":"This organization consults with me weekly via phone"
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 5'
    }]
  }, 
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 8987,
    name: 'Research 6',
    submittedBy: 'Oliver Osmond',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'AWAITING_REVIEW',
    "questionnaire":{
      "1":"Yes",
      "2":"No",
      "3":"Yes"
     },
    "entities":[
      {
        "id":61709,
        "name":"Avaya Inc.",
        "status":"Active",
        "public":true,
        "type":"Large Corporation",
        "sponsorResearch":false,
        "description":"A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS",
        "relationships":[
          {
            "person":"Self",
            "relationship":"Other",
            "type":"Other Transactions",
            "amount":"$1-$5,000",
            "comments":"This organization consults with me weekly via phone"
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 6'
    }]
  }, 
  {
    type: 'PROJECT',
    disposition: 222,
    id: 113232,
    name: 'Research 7',
    submittedBy: 'Peter Pratan',
    submittedOn: 1434948767062,
    startDate: 1434548767062,
    status: 'REVISION_NECESSARY',
    "questionnaire":{
      "1":"Yes",
      "2":"No",
      "3":"Yes"
     },
    "entities":[
      {
        "id":61709,
        "name":"Avaya Inc.",
        "status":"Active",
        "public":true,
        "type":"Large Corporation",
        "sponsorResearch":false,
        "description":"A research lab dedicated to finding the cures for diseases such as cancer, diabetes, and MLS",
        "relationships":[
          {
            "person":"Self",
            "relationship":"Other",
            "type":"Other Transactions",
            "amount":"$1-$5,000",
            "comments":"This organization consults with me weekly via phone"
          }
        ]
      }
    ],
    projects: [{
      'name': 'Project 7'
    }]
  }];
  return results;
};

export let getSummariesForReview = (school, sortColumn, sortDirection, query) => {
  let results = [{
    type: 'ANNUAL',
    disposition: 222,
    id: 34324234,
    name: 'Research 1',
    submittedBy: 'John Jack',
    submittedOn: 1434148767062,
    startDate: 1434148767062,
    status: 'IN_PROGRESS',
    projects: [{
      'name': 'Project 1'
    }]
  }, 
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 32432,
    name: 'Research 2',
    submittedBy: 'Kim Kiera',
    submittedOn: 1434948767062,
    startDate: 1434143767062,
    status: 'AWAITING_REVIEW',
    projects: [{
      'name': 'Project 2'
    }]
  }, 
  {
    type: 'PROJECT',
    disposition: 222,
    id: 54364,
    name: 'Research 3',
    submittedBy: 'Lara Lant',
    submittedOn: 1432148767062,
    startDate: 1434448767062,
    status: 'IN_PROGRESS',
    projects: [{
      'name': 'Project 3'
    }]
  }, 
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 76576,
    name: 'Research 4',
    submittedBy: 'Mark Millburn',
    submittedOn: 1434748767062,
    startDate: 1434188767062,
    status: 'REVISION_NECESSARY',
    projects: [{
      'name': 'Project 4'
    }]
  }, 
  {
    type: 'PROJECT',
    disposition: 222,
    id: 9769,
    name: 'Research 5',
    submittedBy: 'Nate Niter',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'REVISION_NECESSARY',
    projects: [{
      'name': 'Project 5'
    }]
  }, 
  {
    type: 'ANNUAL',
    disposition: 222,
    id: 8987,
    name: 'Research 6',
    submittedBy: 'Oliver Osmond',
    submittedOn: 1432148767062,
    startDate: 1434248767062,
    status: 'AWAITING_REVIEW',
    projects: [{
      'name': 'Project 6'
    }]
  }, 
  {
    type: 'PROJECT',
    disposition: 222,
    id: 113232,
    name: 'Research 7',
    submittedBy: 'Peter Pratan',
    submittedOn: 1434948767062,
    startDate: 1434548767062,
    status: 'REVISION_NECESSARY',
    projects: [{
      'name': 'Project 7'
    }]
  }];

  let lowerCaseQuery = query.toLowerCase();
  results = results.filter((disclosure) => {
    return disclosure.projects[0].name.toLowerCase().indexOf(lowerCaseQuery) === 0 ||
           disclosure.submittedBy.toLowerCase().indexOf(lowerCaseQuery) === 0;
  });

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

export let getSummariesForUser = (dbInfo, userId, callback) => {
  ConnectionManager.getConnection((err, connection) => {
    if (err) {
      callback(err);
    }
    else {
      connection.query(`
        SELECT 
          t.description as type, 
          UNIX_TIMESTAMP(d.expired_date)*1000 as expired_date, 
          d.title, 
          s.description as status, 
          UNIX_TIMESTAMP(d.last_review_date)*1000 as last_review_date, 
          d.id
        FROM 
          disclosure d, disclosure_status s, disclosure_type t
        WHERE 
          d.type_cd = t.type_cd and 
          d.status_cd = s.status_cd`, (err, rows) => {
        if (err) {
          callback(err);
        }
        else {
          callback(undefined, rows);
        }
        connection.release();
      }); 
    }
  }, dbInfo);
};

export let getArchivedDisclosures = (dbInfo, userId, callback) => {
  ConnectionManager.getConnection((err, connection) => {
    if (err) {
      callback(err);
    }
    else {
      connection.query(`
        SELECT
          type_cd as type, 
          title, 
          UNIX_TIMESTAMP(submitted_date)*1000 as submitted_date, 
          disposition, 
          start_date 
        FROM 
          disclosure`, (err, rows) => {
        if (err) {
          callback(err);
        }
        else {
          callback(undefined, rows);
        }
        connection.release();
      });
    }
  }, dbInfo);
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
