export function getBuildStatusType (value) {
  switch (value) {
    case 'FAILURE':
      return 'danger'
    case 'SUCCESS':
      return 'success'
    case '':
      return 'info'
    default:
      return 'info'
  }
}
