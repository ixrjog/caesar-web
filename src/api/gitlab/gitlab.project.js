import request from '@/plugin/axios'

const baseUrl = '/gitlab/project'

export function queryGitlabProjectPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function delGitlabProjectById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function syncGitlabProject (instanceId) {
  return request({
    url: baseUrl + '/sync?instanceId=' + instanceId,
    method: 'get'
  })
}
