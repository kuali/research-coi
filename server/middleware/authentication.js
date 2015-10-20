import {getUserInfo} from '../AuthService';

export default function authentication(req, res, next) {
  getUserInfo(req.hostname, req.cookies.authToken)
  .then(userInfo => {
    if (!userInfo) {
      let returnToValue = encodeURIComponent(req.originalUrl);
      res.redirect('/auth?return_to=' + returnToValue);
    } else {
      next();
    }
  }).catch(err => {
    console.err(err);
    next(err);
  });
}
