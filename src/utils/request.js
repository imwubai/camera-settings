import axios from 'axios'
import { apiDomain } from '@/utils/config'
// 所有请求头加上token
import { getToken } from '@/utils/auth'
// axios.defaults.headers.common['token'] = (getToken() || '')
// 设置 baseURL
axios.defaults.baseURL = apiDomain

export {
  axios
}
