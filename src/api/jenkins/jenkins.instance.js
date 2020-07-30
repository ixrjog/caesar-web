import request from '@/plugin/axios'

const baseUrl = '/jenkins/instance'

export function queryJenkinsInstancePage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addJenkinsInstance (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateJenkinsInstance (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delJenkinsInstanceById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
