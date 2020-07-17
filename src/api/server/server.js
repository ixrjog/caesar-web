import request from '@/plugin/axios'

export function queryServerPage (name, serverGroupId, queryIp, envType, tagId, page, length) {
  return request({
    url: '/server/page/query?name=' + name + '&serverGroupId=' + serverGroupId +
      '&queryIp=' + queryIp + '&envType=' + envType + '&tagId=' + tagId + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function fuzzyQueryServerPage (data) {
  return request({
    url: '/server/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function addServer (data) {
  return request({
    url: '/server/add',
    method: 'post',
    data
  })
}

export function updateServer (data) {
  return request({
    url: '/server/update',
    method: 'put',
    data
  })
}

export function deleteServerById (id) {
  return request({
    url: '/server/del?id=' + id,
    method: 'delete'
  })
}

export function queryServerAttribute (id) {
  return request({
    url: '/server/attribute/query?id=' + id,
    method: 'get'
  })
}

export function saveServerAttribute (data) {
  return request({
    url: '/server/attribute/save',
    method: 'put',
    data
  })
}
