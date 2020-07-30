import request from '@/plugin/axios'

const baseUrl = '/jenkins/tpl'

export function queryJobTplPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addJobTpl (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateJobTpl (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delJobTplById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function queryJobTplByInstanceId (instanceId) {
  return request({
    url: baseUrl + '/instance/query?instanceId=' + instanceId,
    method: 'get'
  })
}

export function readJobTplById (id) {
  return request({
    url: baseUrl + '/read?id=' + id,
    method: 'get'
  })
}
