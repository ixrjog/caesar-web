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

export function buildCdJob (data) {
  return request({
    url: baseUrl + '/cd/build',
    method: 'post',
    data
  })
}

export function queryCiJobBuildByBuildId (buildId) {
  return request({
    url: baseUrl + '/ci/build/query?buildId=' + buildId,
    method: 'get'
  })
}

export function queryCiJobBuildArtifact (data) {
  return request({
    url: baseUrl + '/ci/build/artifact/query',
    method: 'post',
    data
  })
}
