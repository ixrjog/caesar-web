import request from '@/plugin/axios'

const baseUrl = '/platform'

export function queryBlockPlatformStatus () {
  return request({
    url: baseUrl + '/block/status/query',
    method: 'get'
  })
}
