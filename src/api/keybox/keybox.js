import request from '@/plugin/axios'

export function queryKeyboxPage (data) {
  return request({
    url: '/keybox/page/query',
    method: 'post',
    data
  })
}

export function addKeybox (data) {
  return request({
    url: '/keybox/add',
    method: 'post',
    data
  })
}

export function delKeyboxById (id) {
  return request({
    url: '/keybox/del?id=' + id,
    method: 'delete'
  })
}
