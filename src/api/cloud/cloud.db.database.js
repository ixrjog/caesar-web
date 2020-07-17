import request from '@/plugin/axios'

/**
 * 模糊查询
 * @param data
 * @returns {AxiosPromise}
 */
export function fuzzyQueryCloudDBDatabasePage (data) {
  return request({
    url: '/cloud/db/database/page/fuzzy/query',
    method: 'post',
    data
  })
}

export function deleteCloudDBDatabaseById (id) {
  return request({
    url: '/cloud/db/database/del?id=' + id,
    method: 'delete'
  })
}

export function updateCloudDBDatabase (data) {
  return request({
    url: '/cloud/db/database/update',
    method: 'put',
    data
  })
}

export function queryCloudDBDatabaseSlowLogPage (data) {
  return request({
    url: '/cloud/db/database/slowlog/page/query',
    method: 'post',
    data
  })
}
