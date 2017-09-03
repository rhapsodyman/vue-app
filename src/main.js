import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App'
import store from './store/store.js'

Vue.use(Vuetify)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store: store
})
