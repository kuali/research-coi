export default function (req, res, next) {
  if (req.method === undefined) {
    next('No method on request');
  }
  else {
    next();
  }
}
