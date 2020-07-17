// eslint-disable-next-line no-unused-vars
const frameIn = [
  {
    path: '/binlog/config',
    name: 'binlog-config',
    component: () => import('@/pages/binlog-config'),
    meta: {
      auth: true,
      title: 'binlog订阅管理'
    }
  },
  {
    path: '/business/detail',
    name: 'business-detail',
    component: () => import('@/pages/business-detail'),
    meta: {
      auth: true,
      title: '业务域管理'
    }
  },
  // 演示页面
  // {
  //   path: 'page1',
  //   name: 'page1',
  //   meta: {
  //     title: '页面 1',
  //     auth: true
  //   },
  //   component: _import('demo/page1')
  // },
  // {
  //   path: 'page2',
  //   name: 'page2',
  //   meta: {
  //     title: '页面 2',
  //     auth: true
  //   },
  //   component: _import('demo/page2')
  // },
  // {
  //   path: 'page3',
  //   name: 'page3',
  //   meta: {
  //     title: '页面 3',
  //     auth: true
  //   },
  //   component: _import('demo/page3')
  // },
  // binlog订阅配置
  {
    path: '/rule/detail',
    name: 'rule-detail',
    component: () => import('@/pages/rule-detail'),
    meta: {
      auth: true,
      title: '规则SQL管理'
    }
  },
  {
    path: '/rule/equal',
    name: 'rule-equal',
    component: () => import('@/pages/rule-equal'),
    meta: {
      auth: true,
      title: '规则等式'
    }
  },
  {
    path: '/rule/check/failure',
    name: 'rule-check-failure',
    component: () => import('@/pages/rule-check-failure'),
    meta: {
      auth: true,
      title: '检查失败记录'
    }
  },
  {
    path: '/business/rule',
    name: 'business-rule',
    component: () => import('@/pages/business-rule'),
    meta: {
      auth: true,
      title: '业务规则'
    }
  },
  {
    path: '/business/rule/detail',
    name: 'business-rule-detail',
    component: () => import('@/pages/business-rule-detail'),
    meta: {
      auth: true,
      title: '业务规则详情'
    }
  },
  {
    path: '/sql/debug',
    name: 'sql-debug',
    component: () => import('@/pages/sql-debug'),
    meta: {
      auth: true,
      title: 'SQL调试'
    }
  },
  {
    path: '/sql/debug/result',
    name: 'sql-debug',
    component: () => import('@/pages/sql-debug-detail'),
    meta: {
      auth: true,
      title: 'SQL调试结果'
    }
  }
]
