<template>
      <v-flex xs12 lg6>
        <v-card class='mt-2 mb-2'>
          <v-card-title  class='pb-0 pr-0 pt-0 title'>{{sectionLabel}}</v-card-title>
            <v-card-text class='pt-1 pr-1 pb-1 pl-1'>
              <app-filter v-for='filter in filters'
                  :filter='filter'
                  :key='filter.bindName'
              ></app-filter>
            </v-card-text>
        </v-card>
      </v-flex>
</template>

<script>
import Filter from './Filter'
export default {
  props: ['sectionLabel', 'filters'],
  components: {
      'app-filter': Filter
  },
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
