import request from '@/plugin/axios'

export function querySettingMapByName (name) {
  return request({
    url: '/setting/query?name=' + name,
    method: 'get'
  })
}

export function querySettingMap () {
  return request({
    url: '/setting/all/query',
    method: 'get'
  })
}

export function updateSetting (data) {
  return request({
    url: '/setting/update',
    method: 'put',
    data
  })
}
