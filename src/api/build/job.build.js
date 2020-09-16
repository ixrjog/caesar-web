import request from '@/plugin/axios'

const baseUrl = '/job'

export function queryCiJobBuildPage (data) {
  return request({
    url: baseUrl + '/ci/build/page/query',
    method: 'post',
    data
  })
}

export function queryCdJobBuildPage (data) {
  return request({
    url: baseUrl + '/cd/build/page/query',
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

export function abortBuildCiJob (ciBuildId) {
  return request({
    url: baseUrl + '/ci/build/abort?ciBuildId=' + ciBuildId,
    method: 'put'
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

export function queryCdJobBuildByBuildId (buildId) {
  return request({
    url: baseUrl + '/cd/build/query?buildId=' + buildId,
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

export function viewJobBuildOutput (data) {
  return request({
    url: baseUrl + '/build/output/view',
    method: 'post',
    data
  })
}


export function queryCdJobHostPatternByJobId (cdJobId) {
  return request({
    url: baseUrl + '/cd/host/pattern/query?cdJobId=' + cdJobId,
    method: 'get'
  })
}
