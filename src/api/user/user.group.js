import request from '@/plugin/axios'

/**
 * 用户名查询
 * @param username
 * @param page
 * @param length
 * @returns {AxiosPromise}
 */
export function queryUserGroupPage (name, grpType, workflow, extend, page, length) {
  return request({
    url: '/user/group/page/query?name=' + name + '&grpType=' + grpType + '&workflow=' + workflow + '&extend=' + extend + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function addUserGroup (data) {
  return request({
    url: '/user/group/add',
    method: 'post',
    data
  })
}

export function updateUserGroup (data) {
  return request({
    url: '/user/group/update',
    method: 'put',
    data
  })
}

export function deleteUserGroupById (id) {
  return request({
    url: '/user/group/del?id=' + id,
    method: 'delete'
  })
}

export function syncUserGroup () {
  return request({
    url: '/user/group/ldap/sync',
    method: 'get'
  })
}

export function grantUserUserGroup (userId, userGroupId) {
  return request({
    url: '/user/group/grant?userId=' + userId + '&userGroupId=' + userGroupId,
    method: 'get'
  })
}

export function revokeUserUserGroup (userId, userGroupId) {
  return request({
    url: '/user/group/revoke?userId=' + userId + '&userGroupId=' + userGroupId,
    method: 'delete'
  })
}

export function queryUserIncludeUserGroupPage (userId, page, length) {
  return request({
    url: '/user/include/group/page/query?userId=' + userId + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function queryUserExcludeUserGroupPage (userId, queryName, page, length) {
  return request({
    url: '/user/exclude/group/page/query?userId=' + userId + '&queryName=' + queryName + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}
