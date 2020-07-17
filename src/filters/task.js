export function getServerTaskText (value) {
  switch (value) {
    case 0:
      return 'Cmd'
    case 1:
      return 'Script'
    case 2:
      return 'Playbook'
    default:
      return '未定义'
  }
}
