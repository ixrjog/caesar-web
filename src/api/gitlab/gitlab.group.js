import request from '@/plugin/axios'

const baseUrl = '/gitlab/group'

export function queryGitlabGroupPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function delGitlabGroupById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function syncGitlabGroup (instanceId) {
  return request({
    url: baseUrl + '/sync?instanceId=' + instanceId,
    method: 'get'
  })
}
