import request from '@/plugin/axios'

const baseUrl = '/kubernetes/cluster'

export function queryKubernetesClusterPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function addKubernetesCluster (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateKubernetesCluster (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delKubernetesClusterById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function queryKubernetesClusterNamespacePage (data) {
  return request({
    url: baseUrl + '/namespace/page/query',
    method: 'post',
    data
  })
}

export function addKubernetesClusterNamespace (data) {
  return request({
    url: baseUrl + '/namespace/add',
    method: 'post',
    data
  })
}

export function updateKubernetesClusterNamespace (data) {
  return request({
    url: baseUrl + '/namespace/update',
    method: 'put',
    data
  })
}

export function delKubernetesClusterNamespaceById (id) {
  return request({
    url: baseUrl + '/namespace/del?id=' + id,
    method: 'delete'
  })
}

export function queryKubernetesExcludeNamespace (data) {
  return request({
    url: baseUrl + '/namespace/exclude/query',
    method: 'post',
    data
  })
}
