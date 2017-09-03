import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    filters : [
      // {
      //   label: 'SECURITY_TYPE',
      //   value: 'ETF',
      //   enabled: true
      // }
    ],
    dependantCategoriesVisibility: {
      'Dependant category' : false
    }
  },

  getters: {
    getFilterByLabel: (state, getters) => (filterLabel) => {
      return state.filters.find(f => f.label === filterLabel)
    },

    getFilters (state){
      return state.filters;
    },

    getCategoriesVisibility (state){
      return state.dependantCategoriesVisibility;
    },
  },

  mutations: {
    setFilter( state, filter ){
      var ind = state.filters.findIndex(f => f.label === filter.label)

      if(ind == -1) state.filters.push(filter)
      else Vue.set(state.filters, ind, filter)
    },

    setFilters( state, filters ){
      state.filters = filters
    },

    setEnabled( state, {filterLabel, enabled} ){
      var ind = state.filters.findIndex(f => f.label === filterLabel)
      if (ind != -1) {
        Vue.set(state.filters[ind], 'enabled', enabled);
      }
    },

    setCategoryEnabled( state, {categoryName, enabled} ){
      state.dependantCategoriesVisibility[categoryName] = enabled

    },
  },

  actions: {
    setFilter( { commit }, filter) {
      commit('setFilter', filter)
    },

    setFilters( { commit }, filters) {
      commit('setFilters', filters)
    },

    setEnabled( { commit }, {filterLabel, enabled}) {
      commit('setEnabled', {filterLabel, enabled})
    },

    setCategoryEnabled( { commit }, {categoryName, enabled}) {
      commit('setCategoryEnabled', {categoryName, enabled})
    },
  }
})

export default store
