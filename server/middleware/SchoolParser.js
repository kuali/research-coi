function SchoolDetector (req, res, next) {
  req.school = req.hostname.replace('.kuali.co', '');
  next();
}

export default SchoolDetector;