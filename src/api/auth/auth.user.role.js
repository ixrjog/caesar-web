import request from '@/plugin/axios'

export function queryUserRolePage (username, roleId, page, length) {
  return request({
    url: '/auth/user/role/page/query?username=' + username + '&roleId=' + roleId + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function addUserRole (data) {
  return request({
    url: '/auth/user/role/add',
    method: 'post',
    data
  })
}

export function deleteUserRoleById (id) {
  return request({
    url: '/auth/user/role/del?id=' + id,
    method: 'delete'
  })
}
