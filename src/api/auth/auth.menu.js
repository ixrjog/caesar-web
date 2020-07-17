import request from '@/plugin/axios'

export function saveRoleMenu (data) {
  return request({
    url: '/auth/role/menu/save',
    method: 'put',
    data
  })
}

export function queryRoleMenuByRoleId (roleId) {
  return request({
    url: '/auth/role/menu/query?roleId=' + roleId,
    method: 'get'
  })
}
