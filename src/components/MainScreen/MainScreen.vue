<style lang="sass">
  @import "MainScreen.scss"
</style>

<template>
  <div @click="resetTimeout()" fill-height fluid class="main-menu__container">
    <v-row class="main-menu__header" align="center" justify="center">
      <v-col class="main-menu__header-item" align="start">
        {{printer.name}}
      </v-col>
      <v-col class="main-menu__header-item" align="center">
        {{Math.round(printer.nozzle.actual)}}°C / {{Math.round(printer.bed.actual)}}°C
      </v-col>
      <v-col class="main-menu__header-item" align="end">
        {{printer.state}}
      </v-col>
    </v-row>
    <v-row class="main-menu__row" align="center" justify="center">
      <v-col @click="goto('/files')" v-ripple class="main-menu__item">
        <img class="main-menu__item-icon" :src="require('@/assets/folder.svg')"><br>
        <span style="margin-left: 0.5vw;" class="main-menu__item-title">files</span>
      </v-col>
      <v-col @click="goto('/filament')" v-ripple class="main-menu__item">
        <img class="main-menu__item-icon" :src="require('@/assets/filament.svg')"><br>
        <span class="main-menu__item-title">filament</span>
      </v-col>
    </v-row>
    <v-row class="main-menu__row" align="center" justify="center">
      <v-col @click="goto('/control')" v-ripple class="main-menu__item">
        <img style="margin-left: 0vw; width: 8vw;" class="main-menu__item-icon" :src="require('@/assets/control.svg')"><br>
        <span class="main-menu__item-title">control</span>
      </v-col>
      <v-col @click="goto('/utilities')" v-ripple class="main-menu__item">
        <img class="main-menu__item-icon" :src="require('@/assets/utilities.svg')"><br>
        <span class="main-menu__item-title">utilities</span>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {OctoprintAPI} from '../../octoprint-api/api.ts'
  import {config} from "../../config.ts"
  export default Vue.extend({
    name: 'MainScreen',
    mixins: [OctoprintAPI],
    mounted: function() {
      this.printer.name = config.printerName
      this.screenTimeout = setTimeout(() => {
        this.$router.push("/asleep");
      }, 60000);
      this.update();
      setInterval(this.update, 2500);
    },
    methods: {
      resetTimeout: function() {
        console.log(this);
        clearTimeout(this.screenTimeout);
        this.screenTimeout = setTimeout(() => {
          this.$router.push("/asleep");
        }, 60000);
      },
      update: function() {
        this.getPrinterStatus().then((data) => {
          this.printer.state = data.state.text
          if(data.state.text == "Printing") {
            this.$router.push("/now-printing");
          }
          this.printer.nozzle.actual = data.temperature.tool0.actual
          this.printer.bed.actual = data.temperature.bed.actual
        })
      }
    },
    data: function() {
      return {
        screenTimeout: null,
        printer: {
          name: "",
          state: "",
          nozzle: {
            actual: 0
          },
          bed: {
            actual: 0
          }
        }
      };
    }
  })
</script>
