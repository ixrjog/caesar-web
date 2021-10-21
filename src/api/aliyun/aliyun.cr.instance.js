import request from '@/plugin/axios'

const baseUrl = '/aliyun/cr/instance'

export function queryCRInstancePage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function syncCRInstance () {
  return request({
    url: baseUrl + '/sync',
    method: 'get'
  })
}

export function setInstanceActive (id) {
  return request({
    url: baseUrl + '/active/set?id=' + id,
    method: 'put'
  })
}

export function deleteInstanceById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
