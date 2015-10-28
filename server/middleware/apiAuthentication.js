import {getUserInfo} from '../services/authService/AuthService';
import Log from '../Log';

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
  let authToken = getAuthToken(req.headers.authorization);
  if (req.url.startsWith('/coi/files') && req.method === 'GET' && !authToken) {
    authToken = req.cookies.authToken;
  }

  getUserInfo(req.dbInfo, req.hostname, authToken)
    .then(userInfo => {
      if (!userInfo) {
        res.sendStatus(401);
      } else {
        req.userInfo = userInfo;
        next();
      }
    }).catch(err => {
      Log.error(err);
      next(err);
    });
}

