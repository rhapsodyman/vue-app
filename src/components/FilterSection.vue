<template>
        <v-card v-show="filtersToShow.length != 0" class='mt-3 mr-2 pt-2'>
          <v-card-title
              class='pb-0 pr-0 pt-0 title'>
              {{sectionLabel}}
          </v-card-title>
          <v-card-text class='pt-0 pr-1 pb-1 pl-1'>
              <app-filter
                  v-for='filter in filtersToShow'
                  :filter='filter'
                  :key='filter.bindName'
                  :index="index"
              ></app-filter>
          </v-card-text>
        </v-card>
</template>

<script>
import Filter from './Filter'
// import filters from '../../data/filters';
export default {
  props: ['sectionLabel', 'filters', 'index'],
  components: {
      'app-filter': Filter
  },
  data () {
    return {
    }
  },


 computed: {

     filtersToShow () {
       var toShow = []

       try {
       var selected_cat = this.$store.getters.getSelectedSecType(this.index)
       // console.log('Selected cat is ' + selected_cat)

       for (let index = 0; index < this.filters.length; index++) {
         const filter = this.filters[index];
         //console.log(filter.supportedFor)

          var visible = true       
          if (filter.supportedFor != undefined){
               visible = (filter.supportedFor.indexOf(selected_cat) != -1) ? true : false
          }
          if (visible) toShow.push(filter)
        }
       }
       catch (e) {
         toShow = this.filters
       }
        return toShow
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
