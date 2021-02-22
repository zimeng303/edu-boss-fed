/**
 * 用户相关请求模块
 */

import request from '@/utils/request'
import qs from 'qs'

// interface 约定一个对象当中，具体应该有哪些成员，以及成员的类型又是什么样的
interface User {
  phone: string
  password: string
}

// 登录
export const login = (data: User) => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // 如果 data 是普通对象，则 Content-Type 是 application/json
    // 如果 data 是 qs.stringify(data) 转换之后的数据：key1=value1&key2=value2，则 Content-Type 会被设置为 application/x-www-form-urlencoded
    // 如果 data 是 FormData 对象，则 Content-Type 是 multipart/form-data
    data: qs.stringify(data) // axios 默认发送的是 application/json 格式的数据
  })
}

// 获取登录用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
