import request from '@/plugin/axios'

export function queryGroupPage (groupCode, page, length) {
  return request({
    url: '/auth/group/page/query?groupCode=' + groupCode + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function addGroup (data) {
  return request({
    url: '/auth/group/add',
    method: 'post',
    data
  })
}

export function deleteGroupById (id) {
  return request({
    url: '/auth/group/del?id=' + id,
    method: 'delete'
  })
}

export function updateGroup (data) {
  return request({
    url: '/auth/group/update',
    method: 'put',
    data
  })
}
