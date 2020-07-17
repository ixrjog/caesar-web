import request from '@/plugin/axios'

export function fuzzyQueryCloudImagePage (data) {
  return request({
    url: '/cloud/image/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function syncCloudImageByKey (cloudImageKey) {
  return request({
    url: '/cloud/image/sync?key=' + cloudImageKey,
    method: 'get'
  })
}

export function deleteCloudImageById (id) {
  return request({
    url: '/cloud/image/del?id=' + id,
    method: 'delete'
  })
}

export function setCloudImageActiveById (id) {
  return request({
    url: '/cloud/image/active/set?id=' + id,
    method: 'put'
  })
}
