<template>
        <v-card class='mt-3 mr-2 pt-2'>
          <v-card-title
              class='pb-0 pr-0 pt-0 title'>
              {{groupLabel}}
          </v-card-title>
          <v-card-text class='pt-0 pr-1 pb-1 pl-1'>

              <v-layout row wrap>
                <v-flex xs12 sm6>
                <!-- <v-layout column> -->
                  <app-filter-section v-for="section in leftSections"
                  :sectionLabel="section.categoryName"
                  :filters="section.filters"
                  :key="section.categoryName"
                  :dark="darkTheme"
                  :index="index"
                  ></app-filter-section>
                </v-flex>
                <!-- </v-layout> -->

                <!-- <v-layout column> -->
                  <v-flex xs12 sm6>
                  <app-filter-section v-for="section in rightSections"
                  :sectionLabel="section.categoryName"
                  :filters="section.filters"
                  :key="section.categoryName"
                  :dark="darkTheme"
                  :index="index"
                  ></app-filter-section>
                  </v-flex>
                <!-- </v-layout> -->
              </v-layout>
          </v-card-text>
        </v-card>
</template>

<script>
import FilterSection from './FilterSection'
// import filters from '../../data/filters';
export default {
  props: ['groupLabel', 'sections', 'darkTheme', 'index'],
  components: {
      'app-filter-section': FilterSection
  },
  data () {
    return {
      leftSections: [],
      rightSections: []
    }
  },


   mounted ()  {

      // console.log('inside filter group index ' + this.index)

      var left = []
      var right = []

      for (var i = 0; i < this.sections.length; i++) {
        if (i % 2 == 0) left.push(this.sections[i])
         else right.push(this.sections[i])
        }

        this.leftSections = left
        this.rightSections = right
      }


//  computed: {

//      filtersToShow () {

//        var toShow = []
//        var selected_cat = this.$store.getters.getSelectedSecType
//        // console.log('Selected cat is ' + selected_cat)


//        for (let index = 0; index < this.filters.length; index++) {
//          const filter = this.filters[index];
//          //console.log(filter.supportedFor)

//           var visible = true
        
//           if (filter.supportedFor != undefined){
//                visible = (filter.supportedFor.indexOf(selected_cat) != -1) ? true : false
//           }
//           if (visible) toShow.push(filter)
//         }
//         return toShow
//       }
// }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
