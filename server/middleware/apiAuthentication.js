import {getUserInfo} from '../AuthService';

export default function authentication(req, res, next) {
  getUserInfo(req)
  .then(userInfo => {
    if (!userInfo) {
      res.sendStatus(401);
    } else {
      req.userInfo = userInfo;
    }
    next();
  }).catch(err => {
    console.err(err);
    next(err);
  });
}
