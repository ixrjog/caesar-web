import request from '@/plugin/axios'

const baseUrl = '/gitlab/event'

export function queryGitlabEventPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}
