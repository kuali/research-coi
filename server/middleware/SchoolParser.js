function* SchoolDetector (next) {
  this.request.school = this.request.hostname.replace('.kuali.co', '');
  yield next;
}

export default SchoolDetector;