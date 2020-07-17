import request from '@/plugin/axios'

/**
 * 用户查询配置
 * @param settingGroup
 * @returns {AxiosPromise}
 */
export function queryUserSettingByGroup (settingGroup) {
  return request({
    url: '/user/setting/group/query?settingGroup=' + settingGroup,
    method: 'get'
  })
}

/**
 * 用户更新配置
 * @param data
 * @returns {AxiosPromise}
 */
export function saveUserSettingByGroup (data) {
  return request({
    url: '/user/setting/group/save',
    method: 'put',
    data
  })
}
