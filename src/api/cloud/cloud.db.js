import request from '@/plugin/axios'

/**
 * 模糊查询
 * @param data
 * @returns {AxiosPromise}
 */
export function fuzzyQueryCloudDBPage (data) {
  return request({
    url: '/cloud/db/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function syncCloudDB () {
  return request({
    url: '/cloud/db/sync',
    method: 'get'
  })
}

export function deleteCloudDBById (id) {
  return request({
    url: '/cloud/db/del?id=' + id,
    method: 'delete'
  })
}

export function syncCloudDBDatabase (cloudDbId) {
  return request({
    url: '/cloud/db/database/sync?id=' + cloudDbId,
    method: 'get'
  })
}

export function privilegeCloudDBAccount (data) {
  return request({
    url: '/cloud/db/account/privilege',
    method: 'put',
    data
  })
}
