import request from '@/plugin/axios'

const baseUrl = '/application/cd/job'

export function queryCdJobPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addCdJob (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateCdJob (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delCdJobById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function createCdJobEngine (cdJobId) {
  return request({
    url: baseUrl + '/engine/create?cdJobId=' + cdJobId,
    method: 'put'
  })
}

export function queryCdJobEngine (cdJobId) {
  return request({
    url: baseUrl + '/engine/query?cdJobId=' + cdJobId,
    method: 'get'
  })
}
