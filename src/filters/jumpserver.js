export function getUserRoleType (value) {
  switch (value) {
    case 'User':
      return 'success'
    case 'Auditor':
      return 'warning'
    case 'Admin':
      return 'danger'
    default:
      return 'info'
  }
}

export function getUserRoleText (value) {
  switch (value) {
    case 'User':
      return '用户'
    case 'Auditor':
      return '审计员'
    case 'Admin':
      return '管理员'
    default:
      return '未定义'
  }
}
