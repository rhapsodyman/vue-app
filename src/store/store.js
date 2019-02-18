import Vue from 'vue'
import Vuex from 'vuex'
import { SET_LEG_FILTER, SET_LEG_FILTER_ENABLED, SET_LEGS } from './mutation_types'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    legs: [],
    commonFilters: []
  },

  getters: {

    // legs
    getSelectedSecType: (state, getters) => (legId) => {
      return state.legs[legId].selectedSecType;
    },

    getLegFilterByLabel: (state, getters) => (filterLabel, legId) => {
      return state.legs[legId].filters.find(f => f.label === filterLabel)
    },

    getAllLegFilters (state){
      return state.legs;
    },

    // common
    getCommonFilters(state){
      return state.commonFilters;
    },

    getCommonFilterByLabel: (state, getters) => (filterLabel) => {
      return state.commonFilters.find(f => f.label === filterLabel)
    }

    
  },

  mutations: {

    // legs
    addNewLeg( state, leg){
      state.legs.push(leg)
    },

    setSelectedSecType( state, {type, legId}){
      state.legs[legId].selectedSecType = type
    },

      [SET_LEG_FILTER]( state, {filter, legId} ){
      var ind = state.legs[legId].filters.findIndex(f => f.label === filter.label)

      if (ind == -1) state.legs[legId].filters.push(filter)
      else {
        state.legs[legId].filters[ind].value = filter.value
        state.legs[legId].filters[ind].enabled = filter.enabled
        //Vue.set(state.filters, ind, filter)
      }
    },

    [SET_LEGS]( state, legs ){
      state.legs = legs
    },

    [SET_LEG_FILTER_ENABLED]( state, {filterLabel, enabled, legId} ){
      var ind = state.legs[legId].filters.findIndex(f => f.label === filterLabel)
      if (ind != -1) {
        //state.filters[ind], 'enabled', enabled)
        state.legs[legId].filters[ind].enabled = enabled
      }
    },

    // commmon
    setCommonFilter( state, {filter} ){
      var ind = state.commonFilters.findIndex(f => f.label === filter.label)

      if (ind == -1) state.commonFilters.push(filter)
      else {
        state.commonFilters[ind].value = filter.value
        state.commonFilters[ind].enabled = filter.enabled
        //Vue.set(state.filters, ind, filter)
      }
    },

    setCommonFilters( state, filters ){
      state.commonFilters = filters
    },

    setCommonFilterEnabled( state, {filterLabel, enabled} ){
      var ind = state.commonFilters.findIndex(f => f.label === filterLabel)
      if (ind != -1) {
        //state.filters[ind], 'enabled', enabled)
        state.commonFilters[ind].enabled = enabled
      }
    }

  },

  actions: {
  // legs
    addNewLeg( { commit }, leg) {
      commit('addNewLeg', leg)
    },

    setSelectedSecType( { commit }, {type, legId}) {
      commit('setSelectedSecType', {type, legId})
    },

    setLegFilter( { commit }, {filter, legId}) {
      commit(SET_LEG_FILTER, {filter, legId})
    },

    setLegs( { commit }, legs) {
      commit(SET_LEGS, legs)
    },

    setLegFilterEnabled( { commit }, {filterLabel, enabled, legId}) {
      commit(SET_LEG_FILTER_ENABLED, {filterLabel, enabled, legId})
    },

    // common
    setCommonFilter( { commit }, filter) {
      commit('setCommonFilter', filter)
    },

    setCommonFilters( { commit }, filters) {
      commit('setCommonFilters', filters)
    },

    setCommonFilterEnabled( { commit }, {filterLabel, enabled}) {
      commit('setCommonFilterEnabled', {filterLabel, enabled})
    }


  }
})

export default store
