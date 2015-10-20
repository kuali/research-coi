import defaults from 'superagent-defaults';
import cookies from 'cookies-js';

export function processResponse(callback) {
  return (err, res) => {
    if (!err) {
      callback(err, res);
    } else if (err.status === 401) {
      window.location = '/auth/';
    }
  };
}

export function createRequest() {
  let request = defaults();
  request.set('Authorization', 'Bearer ' + cookies.get('authToken'));
  return request;
}
