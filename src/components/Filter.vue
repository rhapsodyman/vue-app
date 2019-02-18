<template>
    <v-card class='mt-2 ml-1 mr-1' >
      <v-card-text class='pb-0 pt-0 pr-1'>
        <v-layout row>
          <v-flex xs6 sm6>
            <v-checkbox
                class='pb-0 pt-0'
                v-bind:label="filter.filterLabel"
                v-model="checkBoxValue"
                hide-details
                color="primary"
            ></v-checkbox>
          </v-flex>

        <v-flex xs6 sm6>
            <v-select
                v-if="filter.type == 'MultiSelect'"
                class='pb-0 pt-0'
                :items='filter.options'
                v-model='selected'
                multiple
                chips
                hide-details
              ></v-select>

          <v-select
              v-if="filter.type == 'Select'"
              class='pb-0 pt-0'
              :items='filter.options'
              v-model="selected"
              single-line
              hide-details
          ></v-select>

          <v-switch
             v-if="filter.type == 'Switch'"
             class='pb-0 pt-0'
             :label="`${stateOfSwitch.toString()}`"
             v-model="selected"
             hide-details
             color="primary"
          ></v-switch>

          <v-text-field
             v-if="filter.type == 'Input'"
             class='pb-0 pt-0'
             v-model="selected"
             hide-details
          ></v-text-field>

        <v-menu
         v-if="filter.type == 'Date'"
          lazy
          :close-on-content-click="false"
          v-model="menu"
          full-width
          max-width="290px"
        >
          <v-text-field
            slot="activator"
            v-model="selected"
            prepend-icon="event"
            readonly
            class='pb-0 pt-0'
          ></v-text-field>
          <v-date-picker v-model="selected" no-title scrollable actions>
            <!-- <template scope="{ save, cancel }">
              <v-card-actions>
                <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                <v-btn flat primary @click.native="save()">Save</v-btn>
              </v-card-actions>
            </template> -->
          </v-date-picker>
        </v-menu>
        </v-flex>


          <v-btn icon v-tooltip:left="{ html: 'Top long long long long long long long long long tooltip\nesfsefsdefse' }">
            <v-icon>info</v-icon>
          </v-btn>

        </v-layout>
      </v-card-text>
    </v-card>
</template>

<script>
export default {
  props: ['filter', 'index'], // index - legId
  data () {
    return { menu: false}
  },

  computed: {

    stateOfSwitch() {
      var f = this.filter.isLegFilter ? this.$store.getters.getLegFilterByLabel(this.filter.bindName, this.index) : this.$store.getters.getCommonFilterByLabel(this.filter.bindName)
      return f == undefined ? false : f.value == 'TRUE'
    },

    checkBoxValue: {
      get () {
        // console.log('inside checkBox GET ' + this.filter.bindName)
        var f = this.filter.isLegFilter ? this.$store.getters.getLegFilterByLabel(this.filter.bindName, this.index) : this.$store.getters.getCommonFilterByLabel(this.filter.bindName)
        if (f != undefined && f.enabled == true){
          return true
        }
        else return false
      },

      set (value) {
        console.log('inside checkBox set')
        var f = this.filter.isLegFilter ? this.$store.getters.getLegFilterByLabel(this.filter.bindName, this.index) : this.$store.getters.getLegFilterByLabel(this.filter.bindName, this.index)
        if(value == false){
          this.filter.isLegFilter ? this.$store.dispatch('setLegFilterEnabled', { filterLabel: this.filter.bindName, enabled: false, legId: this.index }) : this.$store.dispatch('setCommonFilterEnabled', { filterLabel: this.filter.bindName, enabled: false })
        }
        else if (value == true) {
          if (f != undefined) { // need to enabled previously disabled filer
            this.filter.isLegFilter ? this.$store.dispatch('setLegFilterEnabled', { filterLabel: this.filter.bindName, enabled: true, legId: this.index }) : this.$store.dispatch('setCommonFilterEnabled', { filterLabel: this.filter.bindName, enabled: true })
          }
          else {
            var filter = {
              label: this.filter.bindName,
              enabled: true
            }

            switch (this.filter.type) {
              case 'MultiSelect':
              case 'Select':
                filter.value = []
              break;
              case 'Switch':
                filter.value = 'FALSE'
              break;
              default: {
                filter.value = ''
              }
            }
            this.filter.isLegFilter ? this.$store.dispatch('setLegFilter', {filter: filter, legId: this.index} ) : this.$store.dispatch('setCommonFilter', filter)
          }
        }
      }
    },

    selected: {
      get () {
        console.log('inside get ' + this.filter.bindName)
        var f = this.filter.isLegFilter ? this.$store.getters.getLegFilterByLabel(this.filter.bindName, this.index) : this.$store.getters.getCommonFilterByLabel(this.filter.bindName)

        switch (this.filter.type) {
          case 'MultiSelect':
          case 'Select':
            if(f == undefined) return []
              else return f.value
          case 'Switch':
            return f == undefined ? false : f.value == 'TRUE'
          default:
            return f == undefined ? '' : (f.value + '') // can also set a default value here (replace '' with a value)
        }
      },

      set (value) {
        var filter = {
          label: this.filter.bindName,
          enabled: true
        }

        console.log('inside set - value is [' + value  + ']')
        // here needs to be logic for calling store if specific value is selected


        if (this.filter.bindName === 'SECURITY_TYPE' && !Array.isArray(value)) {
          console.log('Setting type to value ' + value)
          this.$store.dispatch('setSelectedSecType', {type: value, legId: this.index})
         }

        switch (this.filter.type) {
          case 'MultiSelect':
            filter.value = value;
          break;
          case 'Switch':
            filter.value = value.toString().toUpperCase()
          break;
          default:
            filter.value = value
          }

          // 'SELECT' filters generate event on resetting - so I dont't want to set the value to store
          if (Array.isArray(value) && value.length == 0) {
           console.log('empty array');
           var f = this.filter.isLegFilter ? this.$store.getters.getLegFilterByLabel(this.filter.bindName, this.index): this.$store.getters.getCommonFilterByLabel(this.filter.bindName)
           if (f){
              this.filter.isLegFilter ? this.$store.dispatch('setLegFilter', {filter: filter, legId: this.index} ) : this.$store.dispatch('setCommonFilter', {filter: filter} )
           }
          }
         else {
           console.log('will be value ' + value);
           this.filter.isLegFilter ? this.$store.dispatch('setLegFilter', {filter: filter, legId: this.index} ) : this.$store.dispatch('setCommonFilter', {filter: filter} )
         }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  div[role=checkbox] label {
    margin: 5px auto;
    display: inline-block;
    font-size: 12px;
    overflow: visible;
    white-space: pre-line;
    line-height: 18px;
  }


</style>
