import request from '@/plugin/axios'

const baseUrl = '/gitlab/instance'

export function queryGitlabInstancePage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addGitlabInstance (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateGitlabInstance (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delGitlabInstanceById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
