import request from '@/plugin/axios'

export function querySessionPage (data) {
  return request({
    url: '/term/session/page/query',
    method: 'post',
    data
  })
}

export function querySessionInstanceById (id) {
  return request({
    url: '/term/session/instance/query?id=' + id,
    method: 'get'
  })
}
