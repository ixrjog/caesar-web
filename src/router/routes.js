import layoutHeaderAside from '@/layout/header-aside'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/libs/util.import.' + process.env.NODE_ENV)

/**
 * 在主框架内显示
 */
const frameIn = [
  {
    path: '/',
    redirect: { name: 'index' },
    component: layoutHeaderAside,
    children: [
      // 首页
      {
        path: 'index',
        name: 'index',
        meta: {
          auth: true
        },
        component: _import('system/index')
      },
      // 系统 前端日志
      {
        path: 'log',
        name: 'log',
        meta: {
          title: '前端日志',
          auth: true
        },
        component: _import('system/log')
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: _import('system/function/refresh')
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: _import('system/function/redirect')
      },
      // env
      {
        path: '/env',
        name: 'env',
        component: () => import('@/pages/env'),
        meta: {
          auth: true,
          title: '环境配置'
        }
      },
      // tag
      {
        path: '/tag',
        name: 'tag',
        component: () => import('@/pages/tag'),
        meta: {
          auth: true,
          title: '标签配置'
        }
      },
      {
        path: '/workorder/mgmt',
        name: 'workorder-mgmt',
        component: () => import('@/pages/workorder/mgmt'),
        meta: {
          auth: true,
          title: '工单配置'
        }
      },
      {
        path: '/setting/keybox',
        name: 'setting-keybox',
        component: () => import('@/pages/setting/keybox'),
        meta: {
          auth: true,
          title: '密钥配置'
        }
      },
      {
        path: '/setting/global',
        name: 'setting-global',
        component: () => import('@/pages/setting/global'),
        meta: {
          auth: true,
          title: '全局参数'
        }
      },
      // server(group)
      {
        path: '/server',
        name: 'server',
        component: () => import('@/pages/server'),
        meta: {
          auth: true,
          title: '服务器'
        }
      },
      {
        path: '/server/attribute',
        name: 'card',
        component: () => import('@/pages/server/attribute'),
        meta: {
          auth: true,
          title: '服务器属性'
        }
      },
      {
        path: '/server/group',
        name: 'server-group',
        component: () => import('@/pages/server/group'),
        meta: {
          auth: true,
          title: '服务器组'
        }
      },
      {
        path: '/server/group/type',
        name: 'server-groupp-type',
        component: () => import('@/pages/server/group/type'),
        meta: {
          auth: true,
          title: '服务器组类型'
        }
      },
      // opscloud auth
      {
        path: '/auth/role',
        name: 'auth-role',
        component: () => import('@/pages/auth/role'),
        meta: {
          auth: true,
          title: '角色管理'
        }
      },
      {
        path: '/auth/resource',
        name: 'auth-resource',
        component: () => import('@/pages/auth/resource'),
        meta: {
          auth: true,
          title: '资源管理'
        }
      },
      {
        path: '/auth/user/role',
        name: 'auth-user-role',
        component: () => import('@/pages/auth/user-role'),
        meta: {
          auth: true,
          title: '用户角色管理'
        }
      },
      {
        path: '/cloud/server/ecs',
        name: 'cloud-server-ecs',
        component: () => import('@/pages/cloud/server/ecs'),
        meta: {
          auth: true,
          title: 'ECS主机管理'
        }
      },
      {
        path: '/cloud/server/ec2',
        name: 'cloud-server-ec2',
        component: () => import('@/pages/cloud/server/ec2'),
        meta: {
          auth: true,
          title: 'EC2主机管理'
        }
      },
      {
        path: '/cloud/server/cvm',
        name: 'cloud-server-cvm',
        component: () => import('@/pages/cloud/server/cvm'),
        meta: {
          auth: true,
          title: 'CVM主机管理'
        }
      },
      {
        path: '/cloud/server/esxi',
        name: 'cloud-server-esxi',
        component: () => import('@/pages/cloud/server/esxi'),
        meta: {
          auth: true,
          title: 'ESXi主机管理'
        }
      },
      {
        path: '/cloud/server/vm',
        name: 'cloud-server-vm',
        component: () => import('@/pages/cloud/server/vm'),
        meta: {
          auth: true,
          title: 'VM主机管理'
        }
      },
      {
        path: '/cloud/server/zabbixhost',
        name: 'cloud-server-zabbixhost',
        component: () => import('@/pages/cloud/server/zabbixhost'),
        meta: {
          auth: true,
          title: 'ZabbixHost主机管理'
        }
      },
      // cloudDB
      {
        path: '/cloud/db/instance',
        name: 'cloud-db-instance',
        component: () => import('@/pages/cloud/db/instance'),
        meta: {
          auth: true,
          title: '数据库实例详情'
        }
      },
      {
        path: '/cloud/db/database',
        name: 'cloud-db-database',
        component: () => import('@/pages/cloud/db/database'),
        meta: {
          auth: true,
          title: '数据库'
        }
      },
      {
        path: '/cloud/db/database/slowlog',
        name: 'cloud-db-database-slowlog',
        component: () => import('@/pages/cloud/db/database/slowlog'),
        meta: {
          auth: true,
          title: '慢日志'
        }
      },
      {
        path: '/cloud/aliyun/ram',
        name: 'cloud-aliyun-ram',
        component: () => import('@/pages/cloud/aliyun/ram'),
        meta: {
          auth: true,
          title: '访问控制'
        }
      },
      {
        path: '/cloud/aliyun/log',
        name: 'cloud-aliyun-log',
        component: () => import('@/pages/cloud/aliyun/log'),
        meta: {
          auth: true,
          title: '日志服务'
        }
      },
      {
        path: '/kubernetes/application',
        name: 'kubernetes-application',
        component: () => import('@/pages/kubernetes/application'),
        meta: {
          auth: true,
          title: 'Kubernetes应用管理'
        }
      },
      {
        path: '/kubernetes/application/instance',
        name: 'kubernetes-application-instance',
        component: () => import('@/pages/kubernetes/application/instance'),
        meta: {
          auth: true,
          title: 'Kubernetes应用实例管理'
        }
      },
      {
        path: '/kubernetes/cluster',
        name: 'kubernetes-cluster',
        component: () => import('@/pages/kubernetes/cluster'),
        meta: {
          auth: true,
          title: 'Kubernetes集群管理'
        }
      },
      {
        path: '/kubernetes/deployment',
        name: 'kubernetes-deployment',
        component: () => import('@/pages/kubernetes/deployment'),
        meta: {
          auth: true,
          title: 'Kubernetes无状态'
        }
      },
      {
        path: '/kubernetes/service',
        name: 'kubernetes-service',
        component: () => import('@/pages/kubernetes/service'),
        meta: {
          auth: true,
          title: 'Kubernetes服务'
        }
      },
      {
        path: '/kubernetes/template',
        name: 'kubernetes-template',
        component: () => import('@/pages/kubernetes/template'),
        meta: {
          auth: true,
          title: 'Kubernetes模版'
        }
      },
      {
        path: '/jump/jumpserver/settings',
        name: 'jump-jumpserver-settings',
        component: () => import('@/pages/jump/jumpserver/settings'),
        meta: {
          auth: true,
          title: 'Jumpserver设置'
        }
      },
      {
        path: '/jump/jumpserver/user',
        name: 'jump-jumpserver-user',
        component: () => import('@/pages/jump/jumpserver/user'),
        meta: {
          auth: true,
          title: 'Jumpserver用户管理'
        }
      },
      {
        path: '/jump/jumpserver/asset',
        name: 'jump-jumpserver-asset',
        component: () => import('@/pages/jump/jumpserver/asset'),
        meta: {
          auth: true,
          title: 'Jumpserver资产管理'
        }
      },
      {
        path: '/term/session',
        name: 'term-session',
        component: () => import('@/pages/term/session'),
        meta: {
          auth: true,
          title: 'Web终端会话管理'
        }
      },
      {
        path: '/workbench/workorder',
        name: 'workbench-workorder',
        component: () => import('@/pages/workbench/workorder'),
        meta: {
          auth: true,
          title: '工作台-工单'
        }
      },
      {
        path: '/workbench/jump',
        name: 'workbench-jump',
        component: () => import('@/pages/workbench/jump'),
        meta: {
          auth: true,
          title: '工作台-堡垒机'
        }
      },
      {
        path: '/workbench/xterm',
        name: 'workbench-xterm',
        component: () => import('@/pages/workbench/xterm'),
        meta: {
          auth: true,
          title: '工作台-Web终端'
        }
      },
      {
        path: '/workbench/application',
        name: 'workbench-application',
        component: () => import('@/pages/workbench/application'),
        meta: {
          auth: true,
          title: '工作台-我的应用'
        }
      },
      // task
      {
        path: '/task/ansible/mgmt',
        name: 'task-ansible-mgmt',
        component: () => import('@/pages/task/ansible-mgmt'),
        meta: {
          auth: true,
          title: '配置管理'
        }
      },
      // profile-subscription
      {
        path: '/task/profile/subscription',
        name: 'task-profile-subscription',
        component: () => import('@/pages/task/profile-subscription'),
        meta: {
          auth: true,
          title: '配置订阅'
        }
      },
      {
        path: '/task/command',
        name: 'task-command',
        component: () => import('@/pages/task/command'),
        meta: {
          auth: true,
          title: '批量命令'
        }
      },
      {
        path: '/task/script',
        name: 'task-script',
        component: () => import('@/pages/task/script'),
        meta: {
          auth: true,
          title: '批量脚本'
        }
      },
      {
        path: '/task/playbook',
        name: 'task-playbook',
        component: () => import('@/pages/task/playbook'),
        meta: {
          auth: true,
          title: 'Playbook'
        }
      },
      {
        path: '/task/history',
        name: 'task-history',
        component: () => import('@/pages/task/history'),
        meta: {
          auth: true,
          title: 'History'
        }
      },
      // user
      {
        path: '/user',
        name: 'user',
        component: () => import('@/pages/user'),
        meta: {
          auth: true,
          title: '用户管理'
        }
      },
      {
        path: '/user/group',
        name: 'user-group',
        component: () => import('@/pages/user/group'),
        meta: {
          auth: true,
          title: '用户组管理'
        }
      },
      {
        path: '/user/retired',
        name: 'user-retired',
        component: () => import('@/pages/user/retired'),
        meta: {
          auth: true,
          title: '用户离职管理'
        }
      },
      {
        path: '/org',
        name: 'org',
        component: () => import('@/pages/org'),
        meta: {
          auth: true,
          title: '组织架构'
        }
      },
      {
        path: '/org/department',
        name: 'org-department',
        component: () => import('@/pages/org/department'),
        meta: {
          auth: true,
          title: '部门管理'
        }
      },
      {
        path: '/user/detail',
        name: 'user-detail',
        component: () => import('@/pages/user/detail'),
        meta: {
          auth: true,
          title: '个人详情'
        }
      }
    ]
  }
]

/**
 * 在主框架之外显示
 */
const frameOut = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: _import('system/login')
  }
]

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '*',
    name: '404',
    component: _import('system/error/404')
  }
]

// 导出需要显示菜单的
export const frameInRoutes = frameIn

// 重新组织后导出
export default [
  ...frameIn,
  ...frameOut,
  ...errorPage
]
