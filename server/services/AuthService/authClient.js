import https from 'https';
import cache from '../../LruCache';
import {COIConstants} from '../../../COIConstants';

let getAuthorizationInfo;
try {
  let extensions = require('research-extensions');
  getAuthorizationInfo = extensions.getAuthorizationInfo;
} catch (e) {
  getAuthorizationInfo = (dbInfo) => { //eslint-disable-line no-unused-vars
    return {
      host: process.env.AUTHZ_HOST || 'uit.kuali.dev',
      adminRole: process.env.AUTHZ_ADMIN_ROLE || 'KC-COIDISCLOSURE:COI%20Administrator'
    };
  };
}

function getUserRoles(dbInfo, schoolId, authToken) {
  return new Promise((resolve) => {
    // temp fix
    resolve(COIConstants.ROLES.ADMIN);
    return;
    // end temp fix

    let authInfo = getAuthorizationInfo(dbInfo);
    let options = {
      protocol: 'https:',
      host: authInfo.host,
      path: '/kc-dev/kc-sys-krad/v1/roles/' + authInfo.adminRole + '/principals/' + schoolId + '?qualification=unitNumber:*',
      headers: {
        'Authorization': 'Bearer ' + authToken
      }
    };

    https.get(options, response => {
      if (response.statusCode === 200) {
        resolve(COIConstants.ROLES.ADMIN);
      } else {
        resolve(COIConstants.ROLES.USER);
      }
      response.on('error', () => {
        resolve(COIConstants.ROLES.USER);
      });
    }).on('error', () => {
      resolve(COIConstants.ROLES.USER);
    });
  });
}

export function getUserInfo(dbInfo, hostname, authToken) {
  return new Promise((resolve, reject) => {
    let cachedUserInfo = authToken ? cache.get(authToken) : undefined;
    if (cachedUserInfo) {
      resolve(cachedUserInfo);
    } else {
      let options = {
        protocol: 'https:',
        host: hostname,
        path: '/api/users/current',
        headers: {
          'Accept': 'application/vnd.kuali.v1+json',
          'Authorization': 'Bearer ' + authToken
        }
      };

      https.get(options, response => {
        if (response.statusCode !== 200) {
          resolve();
        } else {
          let body = '';
          response.on('data', function (chunk) {
            body += chunk;
          });
          response.on('end', () => {
            let userInfo = JSON.parse(body);
            getUserRoles(dbInfo, userInfo.schoolId, authToken).then(role => {
              if (!role) {
                userInfo.coiRole = COIConstants.ROLES.USER;
              } else {
                userInfo.coiRole = role;
              }
              cache.set(authToken, userInfo);
              resolve(userInfo);
            }).catch(err => {
              reject(err);
            });
          });
          response.on('error', (err) => {
            reject(err);
          });
        }
      }).on('error', err => {
        reject(err);
      });
    }
  });
}

export function getAuthLink(req) {
  return '/auth?return_to=' + encodeURIComponent(req.originalUrl);
}
