import Vue from 'vue'

import d2Container from './d2-container'

// 注意 有些组件使用异步加载会有影响
Vue.component('d2-container', d2Container)
Vue.component('d2-icon', () => import('./d2-icon'))
Vue.component('d2-markdown', () => import('./d2-markdown'))
Vue.component('d2-icon-svg', () => import('./d2-icon-svg/index.vue'))
Vue.component('d2-highlight', () => import('./d2-highlight'))
Vue.component('d2-ueditor', () => import('./d2-ueditor'))

// 对话框组件
// Vue.component('server-dialog', () => import('./oc/dialog/server/index.bak.vue'))
