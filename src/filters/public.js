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

export function convertBooleanType (value) {
  switch (value) {
    case true:
      return 'success'
    case false:
      return 'warning'
    default:
      return 'info'
  }
}

export function convertBoolenText (value) {
  switch (value) {
    case true:
      return '是'
    case false:
      return '否'
    default:
      return '未定义'
  }
}
