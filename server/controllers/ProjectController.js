import * as ProjectDB from '../db/ProjectDB';
import Log from '../Log';

export let init = app => {
  app.post('/api/coi/projects', function(req, res, next) {
    ProjectDB.saveProjects(req.dbInfo, req.body)
      .then(projects => {
        res.send(projects);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });

  /**
    @Role: user
    Should only return projects associated with the given user
  */
  app.get('/api/coi/projects', function(req, res, next) {
    ProjectDB.getProjects(req.dbInfo, req.userInfo.schoolId)
      .then(projects => {
        res.send(projects);
      })
      .catch(err => {
        Log.error(err);
        next(err);
      });
  });
};
