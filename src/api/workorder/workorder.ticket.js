import request from '@/plugin/axios'

export function createWorkorderTicket (data) {
  return request({
    url: '/workorder/ticket/create',
    method: 'post',
    data
  })
}

export function addWorkorderTicketEntry (data) {
  return request({
    url: '/workorder/ticket/entry/add',
    method: 'post',
    data
  })
}

export function updateWorkorderTicketEntry (data) {
  return request({
    url: '/workorder/ticket/entry/update',
    method: 'post',
    data
  })
}

export function queryWorkorderTicket (id) {
  return request({
    url: '/workorder/ticket/query?id=' + id,
    method: 'get'
  })
}

export function delWorkorderTicketById (id) {
  return request({
    url: '/workorder/ticket/del?id=' + id,
    method: 'delete'
  })
}

export function delWorkorderTicketEntryById (id) {
  return request({
    url: '/workorder/ticket/entry/del?id=' + id,
    method: 'delete'
  })
}

export function submitWorkorderTicket (data) {
  return request({
    url: '/workorder/ticket/submit',
    method: 'put',
    data
  })
}

export function queryWorkorderTicketPage (data) {
  return request({
    url: '/workorder/ticket/page/query',
    method: 'post',
    data
  })
}

export function queryMyWorkorderTicketPage (data) {
  return request({
    url: '/workorder/ticket/my/page/query',
    method: 'post',
    data
  })
}

/**
 * 审批同意
 * @param data
 * @returns {AxiosPromise}
 */
export function agreeWorkorderTicket (ticketId) {
  return request({
    url: '/workorder/ticket/agree?ticketId=' + ticketId,
    method: 'put'
  })
}

/**
 * 审批拒绝
 * @param data
 * @returns {AxiosPromise}
 */
export function disagreeWorkorderTicket (ticketId) {
  return request({
    url: '/workorder/ticket/disagree?ticketId=' + ticketId,
    method: 'put'
  })
}

/**
 * 工单配置-服务器组查询
 * @param data
 * @returns {AxiosPromise}
 */
export function queryUserTicketServerGroupPage (data) {
  return request({
    url: '/workorder/ticket/server/group/query',
    method: 'post',
    data
  })
}

/**
 * 工单配置-用户组查询
 * @param data
 * @returns {AxiosPromise}
 */
export function queryUserTicketUserGroupPage (data) {
  return request({
    url: '/workorder/ticket/user/group/query',
    method: 'post',
    data
  })
}

/**
 * 工单配置-平台角色查询
 * @param data
 * @returns {AxiosPromise}
 */
export function queryUserTicketAuthRolePage (data) {
  return request({
    url: '/workorder/ticket/role/query',
    method: 'post',
    data
  })
}

/**
 * 工单配置-RAM策略查询
 * @param data
 * @returns {AxiosPromise}
 */
export function queryUserTicketRAMPolicyPage (data) {
  return request({
    url: '/workorder/ticket/ram/policy/query',
    method: 'post',
    data
  })
}
