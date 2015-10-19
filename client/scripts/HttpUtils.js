export function processResponse(callback) {
  return (err, res) => {
    if (!err) {
      callback(err, res);
    } else if (err.status === 401) {
      window.location = '/auth/';
    }
  };
}
