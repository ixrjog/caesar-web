import request from '@/plugin/axios'

/**
 * 模糊查询
 * @param data
 * @returns {AxiosPromise}
 */
export function fuzzyQueryUserPage (data) {
  return request({
    url: '/jump/jumpserver/user/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function syncUser () {
  return request({
    url: '/jump/jumpserver/user/sync',
    method: 'get'
  })
}

export function syncUserById (id) {
  return request({
    url: '/jump/jumpserver/user/id/sync?id=' + id,
    method: 'get'
  })
}

export function setUserActive (id) {
  return request({
    url: '/jump/jumpserver/user/active/set?id=' + id,
    method: 'get'
  })
}

export function delUserByUsername (username) {
  return request({
    url: '/jump/jumpserver/user/del?username=' + username,
    method: 'delete'
  })
}

/**
 * 查询管理员/普通用户
 * @param data
 * @returns {AxiosPromise}
 */
export function fuzzyQueryAdminUserPage (data) {
  return request({
    url: '/jump/jumpserver/user/admin/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function authAdmin (id) {
  return request({
    url: '/jump/jumpserver/user/admin/auth?id=' + id,
    method: 'get'
  })
}

export function revokeAdmin (id) {
  return request({
    url: '/jump/jumpserver/user/admin/revoke?id=' + id,
    method: 'get'
  })
}
