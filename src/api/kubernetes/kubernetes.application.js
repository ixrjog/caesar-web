import request from '@/plugin/axios'

const baseUrl = '/kubernetes/application'

export function queryKubernetesApplicationPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function queryMyKubernetesApplicationPage (data) {
  return request({
    url: baseUrl + '/my/page/query',
    method: 'post',
    data
  })
}

export function addKubernetesApplication (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateKubernetesApplication (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delKubernetesApplicationById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}
