import request from '@/plugin/axios'

const baseUrl = '/application'

export function queryApplicationPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addApplication (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateApplication (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delApplicationById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function queryApplicationSCMMember (applicationId) {
  return request({
    url: baseUrl + '/scm/member/query?applicationId=' + applicationId,
    method: 'get'
  })
}

export function addApplicationSCMMember (applicationId, projectId) {
  return request({
    url: baseUrl + '/scm/member/add?applicationId=' + applicationId + '&projectId=' + projectId,
    method: 'put'
  })
}

export function removeApplicationSCMMember (id) {
  return request({
    url: baseUrl + '/scm/member/remove?id=' + id,
    method: 'delete'
  })
}

export function queryApplicationSCMMemberBranch (data) {
  return request({
    url: baseUrl + '/scm/member/branch/query',
    method: 'post',
    data
  })
}
