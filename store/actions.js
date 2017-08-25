import Services from './Services'
export default {
  getWechatSignature({commit},url){
    return Services.getWechatSignature(url)
  },
  getUserByOAuth({commit},url){
    return Services.getUserByOAuth(url)
  },
  async fetchHouses ({ state }) {
    const res = await Services.allHouses()
    state.houses = res.data
    return res
  },
  async fetchCharacters ({ state }) {
    const res = await Services.povCharacters(500)
    state.characters = res.data
    return res
  }
}