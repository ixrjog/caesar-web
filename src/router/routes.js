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
      {
        path: '/caesar/instance',
        name: 'caesar-instance',
        component: () => import('@/pages/caesar/instance'),
        meta: {
          auth: true,
          title: 'Caesar实例管理'
        }
      },
      // jenkins
      {
        path: '/jenkins/instance',
        name: 'jenkins-instance',
        component: () => import('@/pages/jenkins/instance'),
        meta: {
          auth: true,
          title: 'Jenkins实例管理'
        }
      },
      {
        path: '/jenkins/job/template',
        name: 'jenkins-job-template',
        component: () => import('@/pages/jenkins/job/template'),
        meta: {
          auth: true,
          title: 'Jenkins任务模版'
        }
      },
      {
        path: '/jenkins/job/template/version',
        name: 'jenkins-job-template-version',
        component: () => import('@/pages/jenkins/job/template/version'),
        meta: {
          auth: true,
          title: 'Jenkins任务模版版本管理'
        }
      },
      {
        path: '/gitlab/instance',
        name: 'gitlab-instance',
        component: () => import('@/pages/gitlab/instance'),
        meta: {
          auth: true,
          title: 'Gitlab实例管理'
        }
      },
      {
        path: '/gitlab/group',
        name: 'gitlab-group',
        component: () => import('@/pages/gitlab/group'),
        meta: {
          auth: true,
          title: 'Gitlab群组管理'
        }
      },
      {
        path: '/gitlab/project',
        name: 'gitlab-project',
        component: () => import('@/pages/gitlab/project'),
        meta: {
          auth: true,
          title: 'Gitlab项目管理'
        }
      },
      {
        path: '/storage/oss',
        name: 'storage-oss',
        component: () => import('@/pages/storage/oss'),
        meta: {
          auth: true,
          title: '存储-对象存储'
        }
      },
      {
        path: '/application',
        name: 'application',
        component: () => import('@/pages/application'),
        meta: {
          auth: true,
          title: '应用管理'
        }
      },
      {
        path: '/dingtalk',
        name: 'dingtalk',
        component: () => import('@/pages/dingtalk'),
        meta: {
          auth: true,
          title: '钉钉配置'
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
      // continuousIntegration
      {
        path: '/workbench/continuous-integration',
        name: 'workbench-continuous-integration',
        component: () => import('@/pages/workbench/continuous-integration'),
        meta: {
          auth: true,
          title: '工作台-持续集成'
        }
      },
      {
        path: '/job/build/ios',
        name: 'job-build-ios',
        component: () => import('@/pages/jenkins/job/build/ios'),
        meta: {
          auth: true,
          title: 'iOS持续集成构建详情'
        }
      },
      {
        path: '/job/build/android',
        name: 'job-build-android',
        component: () => import('@/pages/jenkins/job/build/android'),
        meta: {
          auth: true,
          title: 'Android持续集成构建详情'
        }
      },
      {
        path: '/job/build/android/reinforce',
        name: 'job-build-android-reinforce',
        component: () => import('@/pages/jenkins/job/build/android/reinforce'),
        meta: {
          auth: true,
          title: 'Android持续集成加固详情'
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
