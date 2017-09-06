<template>
  <v-app light>
    <v-toolbar dark class="primary" fixed>
      <v-toolbar-title>Some Title</v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat @click.native.stop = "openImportDialog">Import</v-btn>
        <v-btn flat @click.native.stop = "calculateAndShowExportFilters(1)">Export</v-btn>
        <v-btn flat>Info</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-container>
        <v-layout row wrap>
          <filter-section v-for='section in sections'
              v-show='calculateSectionIsShown(section)'
              :sectionLabel='section.categoryName'
              :filters='section.filters'
              :key='section.categoryName'
          ></filter-section>
        </v-layout>
      </v-container>
    </main>
    <div id='bottomPanel'>
      <v-layout column>
        <v-flex lg6 offset-lg3>
          <v-card class='pt-0 pb-0'>
            <v-card-text class='pt-0 pb-0'>
              <v-layout row justify-space-around>
                <v-slider label="Num" hide-details v-bind:max="10" v-model="numberOfSymbolsToFetch"></v-slider>
                <v-text-field
                    type="number"
                    hide-details
                    v-model="numberOfSymbolsToFetch"
                ></v-text-field>
                <v-btn
                    primary
                    :loading="loadingResults"
                    :disabled="loadingResults"
                    @click.native="getResults"
                >Search</v-btn>
                <v-btn primary @click.native="tableVisibility = !tableVisibility">Toggle</v-btn>
                <v-btn primary @click.native="clearAllFilters">Reset Filters</v-btn>
              </v-layout>

              <v-data-table
                  v-show='tableVisibility == true'
                  v-bind:headers="headers"
                  :items="tableItems"
                  class="elevation-1"
                  :rows-per-page-items="rowsPerPageArray"
              >
              <template slot="items" scope="props">
                <td class="text-xs-right">{{ props.item.symbol }}</td>
                <td class="text-xs-right">{{ props.item.description }}</td>
                <td class="text-xs-right">{{ props.item.price }}</td>
              </template>
            </v-data-table>
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
        <textarea rows="10">{{exportedFilters}}</textarea>
      </v-card-text>
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
  export default {
    components: {
        'filter-section': FilterSection
    },

    data () {
      return {
        sections: [],
        saveDialog: false,
        importDialog : false,
        exportedFilters : '',
        numberOfSymbolsToFetch : 1,
        tableVisibility : false,
        loadingResults : false,
        showMultileg: false,
        displayFilterWarning: false,
        warningMessage: '',
        filterAlerts: [],
        rowsPerPageArray: [5],

        headers: [
          { text: 'Symbol', value: 'symbol' },
          { text: 'Description', value: 'description' },
          { text: 'Price', value: 'price' },

        ],
        tableItems: []
      }
    },

    methods: {

      calculateSectionIsShown (section) {
        var visible = true
        if (section.categoryName === 'Dependant category') {
          visible = this.$store.getters.getCategoriesVisibility[section.categoryName]
        }
        return visible
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
          //console.log(filters);
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
      //var filters = this.calculateExportFilters(this.numberOfSymbolsToFetch)
      // then display results
      this.loadingResults = true
      this.tableVisibility = false

      axios.get(config.resultsUrl)  // or window.filtersUrl
        .then(response => {
            // console.info(response.data)
            this.tableItems = response.data
            this.loadingResults = false
            this.tableVisibility = true
        })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
        this.loadingResults = false
        this.tableVisibility = true
      });
    }
  },

    mounted ()  {
      axios.get(config.filtersUrl) // or window.filtersUrl
        .then(response => {
            console.info(response.data)
            this.sections = response.data
        })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
    }
  }
</script>

<style>
    textarea {
      width: 100%;
    }
    #bottomPanel {
      width: 100%;
      padding-left: 16px;
      padding-right: 16px;
      position: fixed;
      bottom: 0px;
    }
</style>

<style lang='stylus'>
  @import './stylus/main'
</style>
