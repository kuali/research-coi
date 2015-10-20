import * as ProjectDB from '../db/ProjectDB';

export let init = app => {
  app.post('/api/coi/projects', function(req, res, next) {
    ProjectDB.saveProjects(req.dbInfo, req.body)
      .then(projects => {
        res.send(projects);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });

  app.get('/api/coi/projects', function(req, res, next) {
    ProjectDB.getProjects(req.dbInfo, req.userInfo.schoolId)
      .then(projects => {
        res.send(projects);
      })
      .catch(err => {
        console.error(err);
        next(err);
      });
  });
};
