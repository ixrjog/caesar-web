import request from '@/plugin/axios'

export function queryServerGroupPage (name, grpType, page, length) {
  return request({
    url: '/server/group/page/query?name=' + name + '&grpType=' + grpType + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function addServerGroup (data) {
  return request({
    url: '/server/group/add',
    method: 'post',
    data
  })
}

export function deleteServerGroupById (id) {
  return request({
    url: '/server/group/del?id=' + id,
    method: 'delete'
  })
}

export function updateServerGroup (data) {
  return request({
    url: '/server/group/update',
    method: 'put',
    data
  })
}

export function queryUserIncludeServerGroupPage (userId, page, length) {
  return request({
    url: '/server/group/user/include/page/query?userId=' + userId + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function queryUserExcludeServerGroupPage (userId, queryName, page, length) {
  return request({
    url: '/server/group/user/exclude/page/query?userId=' + userId + '&queryName=' + queryName + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function grantUserServerGroup (userId, serverGroupId) {
  return request({
    url: '/server/group/grant?userId=' + userId + '&serverGroupId=' + serverGroupId,
    method: 'get'
  })
}

export function revokeUserServerGroup (userId, serverGroupId) {
  return request({
    url: '/server/group/revoke?userId=' + userId + '&serverGroupId=' + serverGroupId,
    method: 'delete'
  })
}

export function queryServerGroupAttribute (id) {
  return request({
    url: '/server/group/attribute/query?id=' + id,
    method: 'get'
  })
}

export function saveServerGroupAttribute (data) {
  return request({
    url: '/server/group/attribute/save',
    method: 'put',
    data
  })
}
