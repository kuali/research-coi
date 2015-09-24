import * as ProjectDB from '../db/ProjectDB';
import {getUserInfo} from '../AuthService';

export let init = app => {
  app.get('/api/coi/projects', function(req, res, next) {
    let userInfo = getUserInfo(req.cookies.authToken);
    ProjectDB.getProjects(req.dbInfo, userInfo.id, function(err, projects) {
      if (err) {
        console.error(err);
        next(err);
      }
      else {
        res.send(projects);
      }
    });
  });
};
