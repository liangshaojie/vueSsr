import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import Vuex from 'vuex'



const createStore = ()=>{
  return new Vuex.Store({
    state:{
      houses: [],
      characters: []
    },
    getters,
    actions,
    mutations
  })
}

export default createStore