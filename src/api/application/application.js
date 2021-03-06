import request from '@/plugin/axios'

const baseUrl = '/application'

export function queryApplicationPage (data) {
  return request({
    url: baseUrl + '/page/query',
    method: 'post',
    data
  })
}

export function queryMyApplicationPage (data) {
  return request({
    url: baseUrl + '/my/page/query',
    method: 'post',
    data
  })
}

export function updateMyApplicationRate (data) {
  return request({
    url: baseUrl + '/my/rate/update',
    method: 'put',
    data
  })
}

export function addApplication (data) {
  return request({
    url: baseUrl + '/add',
    method: 'post',
    data
  })
}

export function updateApplication (data) {
  return request({
    url: baseUrl + '/update',
    method: 'put',
    data
  })
}

export function delApplicationById (id) {
  return request({
    url: baseUrl + '/del?id=' + id,
    method: 'delete'
  })
}

export function queryApplicationSCMGroup (applicationId) {
  return request({
    url: baseUrl + '/scm/group/query?applicationId=' + applicationId,
    method: 'get'
  })
}

export function addApplicationSCMGroup (applicationId, groupId) {
  return request({
    url: baseUrl + '/scm/group/add?applicationId=' + applicationId + '&groupId=' + groupId,
    method: 'put'
  })
}

export function removeApplicationSCMGroup (id) {
  return request({
    url: baseUrl + '/scm/group/remove?id=' + id,
    method: 'delete'
  })
}

export function queryApplicationSCMMember (applicationId) {
  return request({
    url: baseUrl + '/scm/member/query?applicationId=' + applicationId,
    method: 'get'
  })
}

export function addApplicationSCMMember (applicationId, projectId) {
  return request({
    url: baseUrl + '/scm/member/add?applicationId=' + applicationId + '&projectId=' + projectId,
    method: 'put'
  })
}

export function removeApplicationSCMMember (id) {
  return request({
    url: baseUrl + '/scm/member/remove?id=' + id,
    method: 'delete'
  })
}

export function queryApplicationSCMMemberBranch (data) {
  return request({
    url: baseUrl + '/scm/member/branch/query',
    method: 'post',
    data
  })
}

export function createApplicationSCMMemberBranch (data) {
  return request({
    url: baseUrl + '/scm/member/branch/create',
    method: 'post',
    data
  })
}

export function queryApplicationSCMMemberBranchCommit (data) {
  return request({
    url: baseUrl + '/scm/member/branch/commit/query',
    method: 'post',
    data
  })
}

export function queryApplicationEngine (applicationId) {
  return request({
    url: baseUrl + '/engine/query?applicationId=' + applicationId,
    method: 'get'
  })
}

export function addApplicationEngine (applicationId, jenkinsInstanceId) {
  return request({
    url: baseUrl + '/engine/add?applicationId=' + applicationId + '&jenkinsInstanceId=' + jenkinsInstanceId,
    method: 'put'
  })
}

export function removeApplicationEngine (id) {
  return request({
    url: baseUrl + '/engine/remove?id=' + id,
    method: 'delete'
  })
}

export function grantUserApplication (applicationId, userId) {
  return request({
    url: baseUrl + '/user/grant?applicationId=' + applicationId + '&userId=' + userId,
    method: 'put'
  })
}

export function revokeUserApplication (applicationId, userId) {
  return request({
    url: baseUrl + '/user/revoke?applicationId=' + applicationId + '&userId=' + userId,
    method: 'delete'
  })
}

export function updateUserApplicationPermission (applicationId, userId) {
  return request({
    url: baseUrl + '/user/permission/update?applicationId=' + applicationId + '&userId=' + userId,
    method: 'put'
  })
}

export function queryServerGroupPage (data) {
  return request({
    url: baseUrl + '/server/group/page/query',
    method: 'post',
    data
  })
}

export function queryApplicationServerGroup (applicationId) {
  return request({
    url: baseUrl + '/server/group/query?applicationId=' + applicationId,
    method: 'get'
  })
}

export function addApplicationServerGroup (data) {
  return request({
    url: baseUrl + '/server/group/add',
    method: 'put',
    data
  })
}

export function removeApplicationServerGroup (id) {
  return request({
    url: baseUrl + '/server/group/remove?id=' + id,
    method: 'delete'
  })
}

export function grantUserApplicationBuildJob (ciJobId, userId) {
  return request({
    url: baseUrl + '/build/job/user/grant?ciJobId=' + ciJobId + '&userId=' + userId,
    method: 'put'
  })
}

export function revokeUserApplicationBuildJob (ciJobId, userId) {
  return request({
    url: baseUrl + '/build/job/user/revoke?ciJobId=' + ciJobId + '&userId=' + userId,
    method: 'delete'
  })
}
