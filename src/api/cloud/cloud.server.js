import request from '@/plugin/axios'

export function queryCloudServerPage (cloudServerType, serverName, queryIp, serverStatus, page, length) {
  return request({
    url: '/cloud/server/page/query?cloudServerType=' + cloudServerType + '&serverName=' + serverName +
      '&queryIp=' + queryIp + '&serverStatus=' + serverStatus + '&page=' + page + '&length=' + length,
    method: 'get'
  })
}

export function syncCloudServerByKey (cloudServerKey) {
  return request({
    url: '/cloud/server/sync?key=' + cloudServerKey,
    method: 'get'
  })
}

export function deleteCloudServerById (id) {
  return request({
    url: '/cloud/server/del?id=' + id,
    method: 'delete'
  })
}
