export default function authentication(req, res, next) {
  if (!req.cookies.authToken) {
    let returnToValue = encodeURIComponent(req.protocol + '://' + req.get('host') + req.originalUrl);
    res.redirect('/coi/auth?return_to=' + returnToValue);
  }
  else {
    next();
  }
}
