import request from '@/plugin/axios'

/**
 * 登录接口
 * @param data
 * @returns {*}
 * @constructor
 */
export function AccountLogin (data) {
  return request({
    url: '/log/login',
    method: 'post',
    data
  })
}
