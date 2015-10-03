/*eslint camelcase:0 */
let getKnex;
try {
  let extensions = require('research-extensions');
  getKnex = extensions.getKnex;
}
catch (err) {
  getKnex = require('./ConnectionManager');
}

export let getProjects = (dbInfo, userId) => {
  let knex = getKnex(dbInfo);
  return knex.select('p.id as id', 'p.title as name', 'p.type_cd as typeCd', 'person.role_cd as roleCd', 'p.sponsor_cd as sponsorCd')
    .from('project as p')
    .innerJoin('project_person as person', 'p.id', 'person.project_id')
    .where({
      'person.person_id': userId,
      'person.active': 1
    });
};

export let saveProjects = (dbInfo, projects) => {
  let knex = getKnex(dbInfo);
  return knex.select('id').from('project').where({
    source_system: projects.sourceSystem,
    source_identifier: projects.sourceIdentifier
  }).then(projectIdResult => {
    if (projectIdResult.length > 0) {
      let projectId = projectIdResult[0].id;
      return saveExistingProjects(dbInfo, projects, projectId);
    } else {
      return saveNewProjects(dbInfo, projects);
    }
  });
};

let saveProjectPersons = (dbInfo, persons, projectId) => {
  let knex = getKnex(dbInfo);
  return knex.select('person_id').from('project_person').where('project_id', projectId)
    .then(personIdResult => {
      if (persons) {
        let queries = persons.map(person => {
          if (personIdResult.find(pr => {
            return pr.person_id === person.personId;
          })) {
            return knex('project_person').update({'active': true, 'role_cd': person.roleCode}).where({'person_id': person.personId, 'project_id': projectId});
          } else {
            return knex('project_person').insert({'active': true, 'role_cd': person.roleCode, 'person_id': person.personId, 'project_id': projectId});
          }
        });

        let deactiveIds = personIdResult.filter(pr => {
          return persons.find(person => {
            return parseInt(person.personId) === pr.person_id;
          }) === undefined;
        });

        if (deactiveIds.length > 0) {
          queries.push(knex('project_person').update('active', false).whereIn('person_id', deactiveIds).where('project_id', projectId));
        }

        return Promise.all(queries);
      } else {
        if (personIdResult.length > 0) {
          return disableAllPersonsForProject(dbInfo, projectId);
        }
      }
    });
};

let saveExistingProjects = (dbInfo, projects, projectId) => {
  let knex = getKnex(dbInfo);
  return knex('project').update({
    title: projects.title,
    type_cd: projects.typeCode,
    source_status: projects.sourceStatus,
    sponsor_cd: projects.sponsorCode,
    sponsor_name: projects.sponsorName,
    start_date: projects.startDate,
    end_date: projects.endDate
  }).where('id', projects.id)
    .then(() => {
      return saveProjectPersons(dbInfo, projects.persons, projectId);
    });
};



let disableAllPersonsForProject = (dbInfo, projectId) => {
  let knex = getKnex(dbInfo);
  return knex('project_person').update('active', false).where('project_id', projectId);
};

let saveNewProjects = (dbInfo, projects) => {
  let knex = getKnex(dbInfo);
  return knex('project').insert({
      title: projects.title,
      type_cd: projects.typeCode,
      source_system: projects.sourceSystem,
      source_identifier: projects.sourceIdentifier,
      source_status: projects.sourceStatus,
      sponsor_cd: projects.sponsorCode,
      sponsor_name: projects.sponsorName,
      start_date: projects.startDate,
      end_date: projects.endDate
    })
    .then(insertResult => {
      if (projects.persons) {
        let projectId = insertResult[0];
        let inserts = projects.persons.map(person => {
          return knex('project_person').insert({
            project_id: projectId,
            person_id: person.personId,
            role_cd: person.roleCode
          });
        });
        return Promise.all(inserts);
      }
    });
};
