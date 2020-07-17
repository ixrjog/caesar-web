import request from '@/plugin/axios'

export function queryServerGroupTypePage (name, grpType, page, length) {
  return request({
    url: '/server/group/type/page/query?name=' + name + '&grpType=' + grpType + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function addServerGroupType (data) {
  return request({
    url: '/server/group/type/add',
    method: 'post',
    data
  })
}

export function deleteServerGroupTypeById (id) {
  return request({
    url: '/server/group/type/del?id=' + id,
    method: 'delete'
  })
}

export function updateServerGroupType (data) {
  return request({
    url: '/server/group/type/update',
    method: 'put',
    data
  })
}
