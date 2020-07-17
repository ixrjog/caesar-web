import request from '@/plugin/axios'

export function queryWorkorderGroupPage (data) {
  return request({
    url: '/workorder/group/page/query',
    method: 'post',
    data
  })
}

export function queryWorkbenchWorkorderGroup () {
  return request({
    url: '/workorder/group/query',
    method: 'get'
  })
}

export function deleteWorkorderGroupById (id) {
  return request({
    url: '/workorder/group/del?id=' + id,
    method: 'delete'
  })
}

export function saveWorkorderGroup (data) {
  return request({
    url: '/workorder/group/save',
    method: 'post',
    data
  })
}
