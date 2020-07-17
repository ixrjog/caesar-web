import request from '@/plugin/axios'

export function querySettings () {
  return request({
    url: '/jump/jumpserver/settings/query',
    method: 'get'
  })
}

export function saveSettings (data) {
  return request({
    url: '/jump/jumpserver/settings/save',
    method: 'post',
    data
  })
}

export function queryTerminal () {
  return request({
    url: '/jump/jumpserver/terminal/query',
    method: 'get'
  })
}

export function queryTerminalSessionPage (data) {
  return request({
    url: '/jump/jumpserver/terminal/session/page/query',
    method: 'post',
    data
  })
}
