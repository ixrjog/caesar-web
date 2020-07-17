export function getCloudDBTypeTagType (value) {
  switch (value) {
    case 0:
      return 'primary'
    case 1:
      return 'warning'
    case 2:
      return 'success'
    case 3:
      return 'info'
    default:
      return 'danger'
  }
}

export function getCloudDBTypeTagText (value) {
  switch (value) {
    case 2:
      return 'Aliyun-DRS-Mysql'
    case 3:
      return 'AWS-DRS-Mysql'
    default:
      return '未定义'
  }
}

export function getRAMUserType (value) {
  switch (value) {
    case 0:
      return 'info'
    case 1:
      return 'primary'
    case 2:
      return 'danger'
    default:
      return 'danger'
  }
}

export function getRAMUserTypeText (value) {
  switch (value) {
    case 0:
      return '默认'
    case 1:
      return '用户'
    case 2:
      return '系统'
    default:
      return '未定义'
  }
}
