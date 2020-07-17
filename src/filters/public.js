export function getActiveType (value) {
  switch (value) {
    case true:
      return 'success'
    case false:
      return 'warning'
    case 1:
      return 'success'
    case 0:
      return 'warning'
    default:
      return 'info'
  }
}

export function getActiveText (value) {
  switch (value) {
    case true:
      return '有效'
    case false:
      return '无效'
    case 1:
      return '有效'
    case 0:
      return '无效'
    default:
      return '未定义'
  }
}
