import Vue from 'vue'
import Vuex from 'vuex'
import { SET_FILTER, SET_FILTERS, SET_ENABLED,  SET_CATEGORY_ENABLED } from './mutation_types'


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
    [SET_FILTER]( state, filter ){
      var ind = state.filters.findIndex(f => f.label === filter.label)

      if(ind == -1) state.filters.push(filter)
      else Vue.set(state.filters, ind, filter)
    },

    [SET_FILTERS]( state, filters ){
      state.filters = filters
    },

    [SET_ENABLED]( state, {filterLabel, enabled} ){
      var ind = state.filters.findIndex(f => f.label === filterLabel)
      if (ind != -1) {
        Vue.set(state.filters[ind], 'enabled', enabled);
      }
    },

    [SET_CATEGORY_ENABLED]( state, {categoryName, enabled} ){
      state.dependantCategoriesVisibility[categoryName] = enabled

    },
  },

  actions: {
    setFilter( { commit }, filter) {
      commit(SET_FILTER, filter)
    },

    setFilters( { commit }, filters) {
      commit(SET_FILTERS, filters)
    },

    setEnabled( { commit }, {filterLabel, enabled}) {
      commit(SET_ENABLED, {filterLabel, enabled})
    },

    setCategoryEnabled( { commit }, {categoryName, enabled}) {
      commit(SET_CATEGORY_ENABLED, {categoryName, enabled})
    },
  }
})

export default store
