import request from '@/plugin/axios'

const baseUrl = '/dingtalk'

export function queryDingtalkPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addDingtalk (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateDingtalk (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delDingtalkById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function testDingtalkById (id) {
  return request({
    url: baseUrl + '/test?id=' + id,
    method: 'get'
  })
}
