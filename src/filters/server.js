export function getStatusTagType (value) {
  switch (value) {
    case 0:
      return 'primary'
    case 1:
      return 'success'
    case 2:
      return 'warning'
    case 3:
      return 'info'
    default:
      return 'danger'
  }
}

export function getStatusTagText (value) {
  switch (value) {
    case 0:
      return '新建'
    case 1:
      return '已录入'
    case 2:
      return '标记删除'
    case 3:
      return '删除'
    default:
      return '未定义'
  }
}

/**
 * 服务器登录类型
 * @param value
 * @returns {string}
 */
export function getLoginTypeText (value) {
  switch (value) {
    case 0:
      return '密钥'
    case 1:
      return '密码'
    default:
      return '未定义'
  }
}

export function getMonitorStatusText (value) {
  switch (value) {
    case -1:
      return '未监控'
    case 0:
      return '启用'
    case 1:
      return '禁用'
    default:
      return '未定义'
  }
}

export function getMonitorStatusType (value) {
  switch (value) {
    case -1:
      return 'info'
    case 0:
      return 'success'
    case 1:
      return 'warning'
    default:
      return 'danger'
  }
}

export function getServerTypeText (value) {
  switch (value) {
    case 0:
      return 'server'
    case 1:
      return 'vmware vm'
    case 2:
      return 'aliyun ecs'
    case 3:
      return 'aws ec2'
    case 4:
      return 'tencent cvm'
    case 5:
      return 'vmware esxi'
    case 6:
      return 'zabbix host'
    default:
      return '未定义'
  }
}

/**
 * 返回换算后的内存单位GiB
 * @param value
 * @returns {string}
 */
export function getMemoryText (value) {
  // const memory = value / 1024
  return value / 1024
}

export function getServerStatusType (value) {
  switch (value) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    case -1:
      return 'warning'
    default:
      return 'danger'
  }
}

export function getServerStatusText (value) {
  switch (value) {
    case 0:
      return '离线'
    case 1:
      return '在线'
    case -1:
      return '不确定'
    default:
      return '未定义'
  }
}
