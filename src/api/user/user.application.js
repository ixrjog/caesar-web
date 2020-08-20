import request from '@/plugin/axios'

const baseUrl = '/user/application'

export function queryApplicationExcludeUserPage (data) {
  return request({
    url: baseUrl + '/exclude/page/query',
    method: 'post',
    data
  })
}

export function queryApplicationIncludeUserPage (data) {
  return request({
    url: baseUrl + '/include/page/query',
    method: 'post',
    data
  })
}
