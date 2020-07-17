import request from '@/plugin/axios'

export function queryRolePage (roleName, resourceName, page, length) {
  return request({
    url: '/auth/role/page/query?roleName=' + roleName + '&resourceName=' + resourceName + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function addRole (data) {
  return request({
    url: '/auth/role/add',
    method: 'post',
    data
  })
}

export function deleteRoleById (id) {
  return request({
    url: '/auth/role/del?id=' + id,
    method: 'delete'
  })
}

export function updateRole (data) {
  return request({
    url: '/auth/role/update',
    method: 'put',
    data
  })
}
