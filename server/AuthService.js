import https from 'https';
import cache from './LruCache';

export function getUserInfo(hostname, authToken) {
  let options = {
    protocol: 'https:',
    host: hostname,
    path: '/api/users/current',
    headers: {
      'Accept': 'application/vnd.kuali.v1+json',
      'Authorization': 'Bearer ' + authToken
    }
  };

  let cachedUserInfo = authToken ? cache.get(authToken) : undefined;
  return new Promise((resolve, reject) => {
    if (cachedUserInfo) {
      resolve(cachedUserInfo);
    } else {
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

// Remove this code when we have school ids for admin
if (userInfo.schoolId == undefined) {
  userInfo.schoolId = 99999999;
}

            cache.set(authToken, userInfo);
            resolve(userInfo);
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
