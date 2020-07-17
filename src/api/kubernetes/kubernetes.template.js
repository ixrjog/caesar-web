import request from '@/plugin/axios'

const baseUrl = '/kubernetes/template'

export function queryKubernetesTemplatePage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addKubernetesTemplate (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateKubernetesTemplate (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delKubernetesTemplateById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
