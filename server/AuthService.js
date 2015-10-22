import https from 'https';
import cache from './LruCache';
import {COIConstants} from '../COIConstants';

let authorizationHost;
let adminRole;
try {
  let extensions = require('research-extensions');
  authorizationHost = extensions.config.authorizationHost || 'uit.kuali.dev';
  adminRole = extensions.config.adminRole || 'KC-COIDISCLOSURE:COI%20Administrator';
} catch (e) {
  authorizationHost = process.env.AUTHZ_HOST || 'uit.kuali.dev';
  adminRole = process.env.AUTHZ_ADMIN_ROLE || 'KC-COIDISCLOSURE:COI%20Administrator';
}

function getUserRoles(schoolId, authToken) {
  return new Promise((resolve) => {
    let options = {
      protocol: 'https:',
      host: authorizationHost,
      path: '/kc-dev/kc-sys-krad/v1/roles/' + adminRole + '/principals/' + schoolId + '?qualification=unitNumber:*',
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

export function getUserInfo(hostname, authToken) {
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
            getUserRoles(userInfo.schoolId, authToken, hostname).then(role => {
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
