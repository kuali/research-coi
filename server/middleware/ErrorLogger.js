import Log from '../Log';

export default function(err, req, res, next) {
  Log.error(err.stack);
  next(err);
}
