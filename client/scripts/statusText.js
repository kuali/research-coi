export function getStatusText(statusValue) {
  switch(statusValue) {
    case 'REVISION_NECESSARY': 
      return 'Revision Necessary';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'AWAITING_REVIEW':
      return 'Awaiting Review';
  }
};