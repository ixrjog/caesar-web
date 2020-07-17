import request from '@/plugin/axios'

const baseUrl = '/profile/subscription'

export function queryProfileSubscriptionPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function delProfileSubscriptionById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function addProfileSubscription (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateProfileSubscription (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function publishProfileSubscriptionById (id) {
  return request({
    url: baseUrl + '/publish?id=' + id,
    method: 'get'
  })
}
