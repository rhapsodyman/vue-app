<template>
        <v-card class='mt-3 mr-2 pt-2'>
          <v-card-title
              class='pb-0 pr-0 pt-0 title'>
              {{sectionLabel}}
          </v-card-title>
          <v-card-text class='pt-0 pr-1 pb-1 pl-1'>
              <app-filter
                  v-for='filter in filters'
                  :filter='filter'
                  :key='filter.bindName'
              ></app-filter>
          </v-card-text>
        </v-card>
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
<style>

</style>
