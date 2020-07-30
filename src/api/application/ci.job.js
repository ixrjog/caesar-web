import request from '@/plugin/axios'

const baseUrl = '/application/ci/job'

export function queryCiJobPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addCiJob (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateCiJob (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delCiJobById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
