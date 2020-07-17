import request from '@/plugin/axios'

const baseUrl = '/kubernetes/deployment'

export function queryKubernetesDeploymentPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function delKubernetesDeploymentById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function syncKubernetesDeployment (namespaceId) {
  return request({
    url: baseUrl + '/sync?namespaceId=' + namespaceId,
    method: 'put'
  })
}
