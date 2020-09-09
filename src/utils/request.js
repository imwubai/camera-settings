import axios from 'axios'
import { apiDomain } from './config'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const request = (parameter) => {
  const token = (getToken() || '')
  const { url, method } = parameter
  // 预先处理参数
  Object.assign(parameter, {
    method: method || 'POST',
    url: apiDomain + url,
    timeout: 5000,
    data: parameter.data || {},
    header: {
      token
    }
  })

  return axios.request(parameter).then((response) => {
    // console.log(123123)
    // console.log(typeof response)
    // return response
  }).catch((e) => {
    const { errorCb, errorMsg } = parameter
    errorCb && errorCb()
    Message({
      message: errorMsg || '服务器异常',
      type: 'error'
    })
    return e
  })
}
export default request
