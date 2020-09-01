import request from '@/plugin/axios'

const baseUrl = '/jenkins'

export function queryEngineStatus () {
  return request({
    url: baseUrl + '/engine/status',
    method: 'get'
  })
}
