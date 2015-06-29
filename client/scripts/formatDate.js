
if (window.navigator.language) {
  moment.locale(window.navigator.language);
}
else {
  moment.locale('en');
}

export function formatDate(date) {
  return moment(date).format('ll');
}