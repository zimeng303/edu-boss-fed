/**
 * 资源相关请求模块
 */
import request from '@/utils/request'

interface Resource {
  name: string | null
  url: string | null
  categoryId: number | null
  current: number
  size: number
}

export const getResourcePages = (data: Resource) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}
