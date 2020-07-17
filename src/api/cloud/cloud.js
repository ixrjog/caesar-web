import request from '@/plugin/axios'

export function queryAliyunAccount () {
  return request({
    url: '/cloud/aliyun/account/query',
    method: 'get'
  })
}
