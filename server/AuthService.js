import https from 'https';
import cache from './LruCache';

export function getUserInfo(req) {
  let options = {
    protocol: 'https:',
    host: req.hostname,
    path: '/api/users/current',
    headers: {
      'Accept': 'application/vnd.kuali.v1+json',
      'Authorization': 'Bearer ' + req.cookies.authToken
    }
  };

  let cachedUserInfo = req.cookies.authToken ? cache.get(req.cookies.authToken) : undefined;
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
            cache.set(req.cookies.authToken, userInfo);
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
