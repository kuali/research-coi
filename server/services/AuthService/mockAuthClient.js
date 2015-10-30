import {COIConstants} from '../../../COIConstants';
export function authView(req, res) {
  res.sendFile('auth.html', {
    root: 'views'
  });
}

function hashCode(toHash){
  var hash = 0;
  if (toHash.length === 0) { return hash; }
  for (let i = 0; i < toHash.length; i++) {
    let char = toHash.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function getUserInfo(dbInfo, hostname, token) {
  return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
    if (!token) {
      resolve();
    }
    let lowercaseToken = token.toLowerCase();
    if (lowercaseToken.startsWith('a')) {
      resolve({
        id: hashCode(token),
        name: 'Admin ' + token,
        username: token,
        email: token + '@email.com',
        createdAt: 1259218800,
        updatedAt: 1259218800,
        role: 'admin',
        firstName: 'Admin',
        lastName: token,
        phone: '801-322-3323',
        schoolId: hashCode(token),
        coiRole: COIConstants.ROLES.ADMIN,
        mock: true
      });
    }
    else {
      resolve({
        id: hashCode(token),
        name: 'User ' + token,
        username: token,
        email: token + '@email.com',
        createdAt: 1259218800,
        updatedAt: 1259218800,
        role: 'user',
        firstName: 'User',
        lastName: token,
        phone: '801-322-3323',
        schoolId: hashCode(token),
        coiRole: COIConstants.ROLES.USER,
        mock: true
      });
    }
  });
}

export function getAuthLink(req) {
  let returnToValue = encodeURIComponent(req.protocol + '://' + req.get('host') + req.originalUrl);
  return '/coi/auth?return_to=' + returnToValue;
}

