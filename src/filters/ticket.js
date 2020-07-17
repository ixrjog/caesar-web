export function getPhaseText (value) {
  switch (value) {
    case 'CREATED_TICKET':
      return '新建'
    case 'APPLIED_TICKET':
      return '提交申请'
    case 'ORG_APPROVAL':
      return '上级审批'
    case 'USERGROUP_APPROVAL':
      return '用户组审批'
    case 'CONFIGURATION':
      return '运维配置阶段'
    case 'FINALIZED':
      return '结束'
    default:
      return '未定义'
  }
}

export function getPhaseType (value) {
  switch (value) {
    case 'CREATED_TICKET':
      return ''
    case 'APPLIED_TICKET':
      return 'warning'
    case 'ORG_APPROVAL':
      return 'danger'
    case 'USERGROUP_APPROVAL':
      return 'danger'
    case 'CONFIGURATION':
      return 'danger'
    case 'FINALIZED':
      return 'success'
    default:
      return 'danger'
  }
}
