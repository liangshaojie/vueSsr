import Services from './Services'
export default {
  getWechatSignature({commit},url){
    return Services.getWechatSignature(url)
  },
  getUserByOAuth({commit},url){
    return Services.getUserByOAuth(url)
  }
}