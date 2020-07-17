import request from '@/plugin/axios'

const baseUrl = '/kubernetes/application/instance'

export function queryKubernetesApplicationInstancePage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addKubernetesApplicationInstance (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateKubernetesApplicationInstance (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delKubernetesApplicationInstanceById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function queryKubernetesApplicationInstanceLable (envType) {
  return request({
    url: baseUrl + '/label/query?envType=' + envType,
    method: 'get'
  })
}

export function queryKubernetesApplicationInstanceTemplatePage (data) {
  return request({
    url: baseUrl + '/template/page/query',
    method: 'post',
    data
  })
}

export function createKubernetesDeployment (data) {
  return request({
    url: baseUrl + '/deployment/create',
    method: 'post',
    data
  })
}

export function delKubernetesDeploymentById (id) {
  return request({
    url: baseUrl + '/deployment/del?id=' + id,
    method: 'delete'
  })
}

export function createKubernetesService (data) {
  return request({
    url: baseUrl + '/service/create',
    method: 'post',
    data
  })
}

export function delKubernetesServiceById (id) {
  return request({
    url: baseUrl + '/service/del?id=' + id,
    method: 'delete'
  })
}
