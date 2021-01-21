import request from '@/plugin/axios'

const baseUrl = '/announcement'

export function queryAnnouncementCarousel () {
  return request({
    url: baseUrl + '/carousel/query',
    method: 'get'
  })
}
