import Log from '../Log';

export default function(err, req, res, next) {
  Log.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  res.send('<html><body>Error</body></html>');
}
