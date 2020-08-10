import request from '@/plugin/axios'

const baseUrl = '/job'

export function queryCiJobBuildPage (data) {
  return request({
    url: baseUrl + '/ci/build/page/query',
    method: 'post',
    data
  })
}

export function buildCiJob (data) {
  return request({
    url: baseUrl + '/ci/build',
    method: 'post',
    data
  })
}
