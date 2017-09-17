<template>
  <v-app :dark="darkTheme">
    <v-navigation-drawer absolute temporary :dark='darkTheme' v-model="drawer" overflow>
      <v-switch class='ml-2' :label="(!darkTheme ? 'Light' : 'Dark') + ' Theme'" v-model="darkTheme" :dark="darkTheme" hide-details></v-switch>
      <v-switch class='ml-2' :label="(!miniToolbar ? 'Full' : 'Mini') + ' Toolbar'" v-model="miniToolbar" :dark="darkTheme" hide-details></v-switch>

    </v-navigation-drawer>

    <v-toolbar dark :class="toolbarTheme" :dense="miniToolbar" fixed>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Some Title</v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat @click.native.stop = "openImportDialog">Import</v-btn>
        <v-btn flat @click.native.stop = "openExportDialog">Export</v-btn>
        <v-btn flat>Info</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>
      <v-menu class="mr-3" offset-y>
        <v-btn icon dark slot="activator">
            <v-icon>format_paint</v-icon>
        </v-btn>
      <v-list>
        <v-list-tile v-for="c in colors" :key="c" :class="c" @mouseover.native="toolbarTheme = c">
        </v-list-tile>
      </v-list>
    </v-menu>


    </v-toolbar>
    <main>
      <v-container fluid>
        <v-layout row wrap>
          <v-layout column>
            <filter-section v-for="section in leftSections"
            v-show="calculateSectionIsShown(section)"
            :sectionLabel="section.categoryName"
            :filters="section.filters"
            :key="section.categoryName"
            :dark="darkTheme"
            ></filter-section>
          </v-layout>

          <v-layout column>
            <filter-section v-for="section in rightSections"
            v-show="calculateSectionIsShown(section)"
            :sectionLabel="section.categoryName"
            :filters="section.filters"
            :key="section.categoryName"
            :dark="darkTheme"
            ></filter-section>
          </v-layout>
        </v-layout>

      </v-container>
    </main>
    <div id='bottomPanel'>
      <v-layout column>
        <v-flex lg8 offset-lg2>
          <v-card class='pt-0'>
            <v-card-text class='pt-0'>
              <v-layout row justify-space-around>
                <v-slider label="№" hide-details v-bind:max="10" v-model="numberOfSymbolsToFetch" thumb-label class="mr-1"></v-slider>
                <v-text-field
                    type="number"
                    hide-details
                    min="1"
                    max="10"
                    v-model="numberOfSymbolsToFetch"
                ></v-text-field>
                <v-btn
                    primary
                    @click.native="getResults"
                >Search</v-btn>
                <v-btn primary @click.native="tabsVisibility = !tabsVisibility" v-tooltip:top="{ html: 'Toggle results' }">Toggle</v-btn>
                <v-btn primary @click.native="clearAllFilters">Reset Filters</v-btn>
              </v-layout>

              <v-tabs v-show="tabsVisibility == true" class="pt-3" dark v-model="activeTab">
                <v-tabs-bar class="indigo darken-2">
                  <v-tabs-item
                      v-for="tab in tabsLabels"
                      :key="tab"
                      :href="'#' + tab"
                      ripple
                  >
                  {{ tab }}
                  <v-icon class="pl-1" @click.stop="removetab(tab)">cancel</v-icon>
                </v-tabs-item>
                <v-tabs-slider class="yellow"></v-tabs-slider>
              </v-tabs-bar>
              <v-tabs-items>
                <v-tabs-content
                    v-for="tab in tabsLabels"
                    :key="tab"
                    :id="tab"
                    >

                <div id="sentFilters">{{ currentTabFilters }}</div>

                <v-data-table
                      :loading="resultsAreLoading"
                      v-bind:headers="headers"
                      :items="currentTabResults"
                      class="elevation-1"
                      :rows-per-page-items="rowsPerPageArray"
                >
                <template slot="items" scope="props">
                  <td class="text-xs-right">{{ props.item.symbol }}</td>
                  <td class="text-xs-right">{{ props.item.description }}</td>
                  <td class="text-xs-right">{{ props.item.price }}</td>
                </template>
              </v-data-table>
            </v-tabs-content>
          </v-tabs-items>
        </v-tabs>

      </v-card-text>
    </v-card>
  </v-flex>
</v-layout>
</div>

  <v-dialog v-model="saveDialog" width="400">
    <v-card>
      <v-card-title>
        <div class="headline">Exported Filters</div>
      </v-card-title>
      <v-card-text class='pt-0 pb-0'>
        <v-checkbox
            @change='onShowMultilegSwitch'
            class='pb-0 pt-0'
            label="Show sent filters"
            v-model="showMultileg"
            hide-details
        ></v-checkbox>
        <textarea ref="exportedFilters" rows="10">{{exportedFilters}}</textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn primary @click.native.stop = "copyToClipboard">Copy</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="importDialog" width="400">
    <v-card>
      <v-card-title>
        <div class="headline">Import Filters</div>
      </v-card-title>
      <v-card-text>

        <v-alert warning transition="scale-transition" dismissible v-model="displayFilterWarning">
          <li v-for="alert in filterAlerts">{{ alert }}</li>
        </v-alert>

        <textarea rows="10" ref="pastedFilters" placeholder="Paste filters here"></textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn primary @click.native.stop = "importFilters">Import</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</v-app>
</template>

<script>
import FilterSection from './components/FilterSection'
import axios from 'axios'
import config from '../data/config'
import impFilters from '../data/filtersBig'

  export default {
    components: {
        'filter-section': FilterSection
    },

    data () {
      return {
        drawer: false,
        darkTheme: false,
        toolbarTheme: 'primary',
        colors: ['black', 'blue', 'grey', 'green', 'purple', 'red'],
        miniToolbar: false,
        sections: [],
        leftSections: [],
        rightSections: [],
        saveDialog: false,
        importDialog : false,
        exportedFilters : '',
        numberOfSymbolsToFetch : 1,
        tabsVisibility : false,
        loadingResults : false,
        showMultileg: false,
        displayFilterWarning: false,
        warningMessage: '',
        filterAlerts: [],
        rowsPerPageArray: [5],
        tabsLabels: [],
        activeTab: null,
        tabsData: {},
        lightTheme: true,

        headers: [
          { text: 'Symbol', value: 'symbol' },
          { text: 'Description', value: 'description' },
          { text: 'Price', value: 'price' },

        ],
      }
    },

    methods: {

      calculateSectionIsShown (section) {
        var visible = true
        // if (section.categoryName === 'Dependant category') {
        //   visible = this.$store.getters.getCategoriesVisibility[section.categoryName]
        // }
        return visible
      },

      openExportDialog () {
        this.showMultileg = false
        this.calculateAndShowExportFilters(1)
      },

      onShowMultilegSwitch (value){
        var number = value ? this.numberOfSymbolsToFetch : 1
        this.calculateAndShowExportFilters(number)
      },

      calculateExportFilters (number) {
        var finalString = ''
        var filters = this.$store.getters.getFilters
        for (var i = 0; i < filters.length; i++) {
          if (filters[i].enabled) {
            var value = this.getFilterValue(filters[i].value, number)
            finalString += (filters[i].label + '=' + value + '\n')
          }
        }
        return finalString
      },

      calculateAndShowExportFilters (number) {
        this.exportedFilters = this.calculateExportFilters(number)
        this.saveDialog = true
      },

      getFilterValue (filterValue, number) {
        var arr = []
        for (var i = 0; i < number; i++) {
          arr.push(filterValue)
        }
        return arr.join('|')
      },

      openImportDialog () {
        this.importDialog = true
        this.displayFilterWarning = false
        this.filterAlerts = []
      },


      importFilters () {
        this.displayFilterWarning = false
        this.filterAlerts = []

        var source = this.$refs.pastedFilters.value.trim()
        var filters = []

        var noWarnings = true
        var lines = source.split(/\r?\n/)
        for (var i = 0; i < lines.length; i++) {
          var arr = lines[i].trim().split('=')

          var foundFilter = this.getFilterByName(arr[0])

          if (foundFilter != undefined) {
            var newFilter = {
              label: arr[0],
              enabled: true
            }
            var value = arr[1]
            if (foundFilter.type == 'MultiSelect') value = value.split(',')

            var warnings = this.getFilterWarnings(foundFilter, value)
            if (warnings.length > 0) {
              noWarnings = false
              Array.prototype.push.apply(this.filterAlerts, warnings)
            }
            else {
              newFilter.value = value
              filters.push(newFilter)
            }
          }
          else {
            noWarnings = false
            this.filterAlerts.push('Unknown filter ' + arr[0])
          }
        }

        if (noWarnings) {
          // add to store
          this.$store.dispatch('setFilters', filters )
          this.importDialog = false
        }
        else {
          this.displayFilterWarning = true
        }
      },


      getFilterWarnings ( filter, passedValue) {
        var warnings = []
        if (filter.type == 'MultiSelect'){
          for (var i = 0; i < passedValue.length; i++) {
            if (filter.options.indexOf(passedValue[i]) === -1) {
              warnings.push('Option ' + passedValue[i] + ' is not valid')
            }
          }
        }
        else if (filter.type == 'Select') {
          if (filter.options.indexOf(passedValue) === -1) {
            warnings.push('Option ' + passedValue + ' is not valid')
          }
        }
        else if (filter.type == 'Switch') {
          if ( !(passedValue === 'TRUE' || passedValue === 'FALSE'))
            warnings.push('Option ' + passedValue + ' is not valid. Should be TRUE/FALSE')
        }
        return warnings

      },


      clearAllFilters () {
        this.$store.dispatch('setFilters', [] )
      },

    getFilterByName (nameToFind) {
      var sections = this.sections
      for (var secInd = 0; secInd < sections.length; secInd++) {
        var section = sections[secInd]
        for (var fInd = 0; fInd < section.filters.length; fInd++) {
          if (section.filters[fInd].bindName === nameToFind) {
            return section.filters[fInd]
          }
        }
      }
      return undefined
    },

    getResults () {
      // here fisrt of all need to pass arguments
      var filtersToSend = this.calculateExportFilters(this.numberOfSymbolsToFetch)
      var filtersToShow = this.calculateExportFilters(1)


      var rightNow = new Date();
      var newTab = (rightNow.toLocaleTimeString() + ':' + rightNow.getMilliseconds()).replace(/:/g, "_")
      //var newTab = rightNow.toISOString().slice(11).replace('Z', '')

      this.tabsVisibility = true
      //var newTab = 'TAB ' + (this.tabsLabels.length + 1)
      this.tabsLabels.unshift(newTab)
      this.activeTab = newTab

      this.$set(this.tabsData, newTab,
        {
          loading: true,
          results: [],
          filters: filtersToShow
        }
      )

      axios.get(config.resultsUrl)  // or window.filtersUrl
        .then(response => {
            // console.info(response.data)
            this.tabsData[newTab].loading = false
            this.tabsData[newTab].results = response.data
        })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
        this.tabsData[newTab].loading = false
      });
    },


    removetab (tab) {
      console.log("inside removetab");

      var index = this.tabsLabels.indexOf(tab)
      if (this.tabsLabels.length === 1) return

      if (tab === this.activeTab){
        if ( index === this.tabsLabels.length -1) { // last tab
          this.activeTab = this.tabsLabels[index - 1]
        }
        else  {
          this.activeTab = this.tabsLabels[index +1]
        }
      }
      this.tabsLabels.splice(index, 1)
      console.log(this.tabsLabels);
    },

    copyToClipboard () {
      var input = this.$refs.exportedFilters
       input.select();
       document.execCommand("copy");
    }
  },


  computed : {
    currentTabResults () {
      return this.tabsData[this.activeTab].results
    },

    resultsAreLoading () {
      return this.tabsData[this.activeTab].loading == true
    },

    currentTabFilters () {
      return this.tabsData[this.activeTab].filters
    }
  },

    mounted ()  {
      // axios.get(config.filtersUrl) // or window.filtersUrl
      //   .then(response => {
      //       console.info(response.data)
      //       this.sections = response.data
      //   })
      // .catch(error => {
      //   console.log('Error fetching and parsing data', error);
      // });
      this.sections = impFilters
      var left = []
      var right = []

      for (var i = 0; i < impFilters.length; i++) {
        if (i % 2 == 0) left.push(impFilters[i])
         else right.push(impFilters[i])
        }

        this.leftSections = left
        this.rightSections = right
      }
  }
</script>

<style>
    textarea {
      width: 100%;
    }

    #sentFilters {
      margin: 10px auto;
      text-align: center;
    }

    #bottomPanel {
      width: 100%;
      padding-left: 16px;
      padding-right: 16px;
      position: fixed;
      bottom: 10px;
    }
</style>

<style lang='stylus'>
  @import './stylus/main'
</style>
