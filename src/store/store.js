import Vue from 'vue'
import Vuex from 'vuex'
import { SET_FILTER, SET_FILTERS, SET_ENABLED,  SET_CATEGORY_ENABLED } from './mutation_types'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    filters : [],
      // {
      //   label: 'SECURITY_TYPE',
      //   value: 'ETF',
      //   enabled: true
      // }

    selectedSecType: 'STOCK',
  },

  getters: {

    getSelectedSecType (state){
      return state.selectedSecType;
    },

    getFilterByLabel: (state, getters) => (filterLabel) => {
      return state.filters.find(f => f.label === filterLabel)
    },

    getFilters (state){
      return state.filters;
    }
  },

  mutations: {

    setSelectedSecType( state, type ){
      state.selectedSecType = type
    },

      [SET_FILTER]( state, filter ){
      var ind = state.filters.findIndex(f => f.label === filter.label)

      if(ind == -1) state.filters.push(filter)
      else {
        state.filters[ind].value = filter.value
        state.filters[ind].enabled = filter.enabled
        //Vue.set(state.filters, ind, filter)
      }
    },

    [SET_FILTERS]( state, filters ){
      state.filters = filters
    },

    [SET_ENABLED]( state, {filterLabel, enabled} ){
      var ind = state.filters.findIndex(f => f.label === filterLabel)
      if (ind != -1) {
        //state.filters[ind], 'enabled', enabled)
        state.filters[ind].enabled = enabled
      }
    }
  },

  actions: {

    setSelectedSecType( { commit }, type) {
      commit('setSelectedSecType', type)
    },

    setFilter( { commit }, filter) {
      commit(SET_FILTER, filter)
    },

    setFilters( { commit }, filters) {
      commit(SET_FILTERS, filters)
    },

    setEnabled( { commit }, {filterLabel, enabled}) {
      commit(SET_ENABLED, {filterLabel, enabled})
    }
  }
})

export default store
