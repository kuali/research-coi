import {getUserInfo} from '../AuthService';

function getAuthToken(header) {
  try {
    let parsedHeader = header.split(' ');
    if (parsedHeader[0] === 'Bearer') {
      return parsedHeader[1];
    } else {
      return undefined;
    }
  } catch(e) {
    return undefined;
  }
}

export default function authentication(req, res, next) {
  getUserInfo(req.hostname, getAuthToken(req.headers.authorization))
  .then(userInfo => {
    if (!userInfo) {
      res.sendStatus(401);
    } else {
      req.userInfo = userInfo;
      next();
    }
  }).catch(err => {
    console.err(err);
    next(err);
  });
}

