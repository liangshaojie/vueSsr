import axios from 'axios'
const baseUrl = ''
const apiUrl = 'http://rapapi.org/mockjsdata/24826/'
class Services{
  getWechatSignature (url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${encodeURIComponent(url)}`)
  }
  getUserByOAuth (url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${encodeURIComponent(url)}`)
  }
  /**
   * 查询所有家族
   * @return {Promise}
   */
  allHouses () {
    return axios.get(`${apiUrl}/wiki/houses`)
  }
  /**
   * 查询主要人物
   * @param {limit} name
   * @return {Promise}
   */
  povCharacters (limit = 20) {
    return axios.get(`${apiUrl}/wiki/characters?limit=${limit}`)
  }
}
export default new Services()