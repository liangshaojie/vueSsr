import axios from 'axios'
const baseUrl = ''
class Services{
  getWechatSignature (url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${encodeURIComponent(url)}`)
  }

}
export default new Services()