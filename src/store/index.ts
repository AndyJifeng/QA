import { createStore } from 'vuex'

export default createStore({
  state: {
    loadding:false
  },
  mutations: {
    showloadding(state, load) {
      state.loadding = load
    }
  },
  actions: {
    setloadding(context,load){
      context.commit("showloadding",load);
    }
  },
  modules: {
  }
})
