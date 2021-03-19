import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import menu from './util.menu.init'

const util = {
  cookies,
  db,
  log,
  menu
}

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

/**
 * 返回UUID
 * @returns {string}
 */
util.uuid = function () {
    let s = []
    let hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'
    let uuid = s.join('')
    return uuid
}

/**
 * 返回ws
 * @returns {string}
 */
util.wsUrl = function (wsUrl) {
  if (process.env.NODE_ENV === 'development') {
    return process.env.VUE_APP_WS_API + wsUrl
  } else {
    let host = window.location.host
    let httpProtocol = window.location.href.split('://')[0]
    return (httpProtocol === 'http' ? 'ws' : 'wss') + '://' + host + '/cs/' + wsUrl
  }
}

export default util
