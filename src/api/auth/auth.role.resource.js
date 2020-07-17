import request from '@/plugin/axios'

export function queryRoleBindResourcePage (roleId, groupId, page, length) {
  return request({
    url: '/auth/role/resource/bind/page/query?roleId=' + roleId + '&groupId=' + groupId + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function queryRoleUnbindResourcePage (roleId, groupId, page, length) {
  return request({
    url: '/auth/role/resource/unbind/page/query?roleId=' + roleId + '&groupId=' + groupId + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function bindRoleResource (data) {
  return request({
    url: '/auth/role/resource/bind',
    method: 'post',
    data
  })
}

export function unbindRoleResource (id) {
  return request({
    url: '/auth/role/resource/unbind?id=' + id,
    method: 'delete'
  })
}
