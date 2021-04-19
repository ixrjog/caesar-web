import request from '@/plugin/axios'

const baseUrl = '/auth'

export function revokeAllUserToken () {
  return request({
    url: baseUrl + '/token/revoke',
    method: 'put'
  })
}
