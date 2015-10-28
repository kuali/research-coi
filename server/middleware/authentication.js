import * as authService from '../services/authService/AuthService';
import Log from '../Log';

export default function authentication(req, res, next) {
  authService.getUserInfo(req.dbInfo, req.hostname, req.cookies.authToken)
    .then(userInfo => {
      if (!userInfo) {
        res.redirect(authService.getAuthLink(req));
      } else {
        req.userInfo = userInfo;
        next();
      }
    }).catch(err => {
      Log.error(err);
      next(err);
    });
}
