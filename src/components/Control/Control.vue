<style lang="sass">
  @import "Control.scss"
</style>

<template>
  <div fill-height fluid class="control__container">
    <v-row class="control__header">
      <v-col @click="goto('/')" class="control__header-item" align="start">
        <span style="float: left; margin-left: 2vw"><v-icon style="margin-top: -3px" color=#fff size=40px>mdi-arrow-left-circle-outline</v-icon></span>
      </v-col>
      <v-col class="control__header-item" align="center">
        <v-icon size=30px color=#fff>mdi-camera-control</v-icon>
      </v-col>
      <v-col class="control__header-item" align="end">
        <span style="float: right; margin-right: 5vw">{{printer.name}}</span>
      </v-col>
    </v-row>
    <v-row class="control__content">
      <v-col :sm="5" class="control__directional-pad">
        <v-row style="height: 107px">
          <v-col></v-col>
          <v-col v-ripple><v-icon style="margin-top: 5px;" size=20vh color=#fff>mdi-arrow-up-thick</v-icon></v-col>
          <v-col></v-col>
        </v-row>
        <v-row style="height: 107px">
          <v-col v-ripple><v-icon size=20vh color=#fff>mdi-arrow-left-thick</v-icon></v-col>
          <v-col v-ripple><v-icon style="margin: auto; top: 15%;" size=14vh color=#fff>mdi-home</v-icon></v-col>
          <v-col v-ripple><v-icon size=20vh color=#fff>mdi-arrow-right-thick</v-icon></v-col>
        </v-row>
        <v-row style="height: 107px">
          <v-col></v-col>
          <v-col v-ripple><v-icon style="margin-bottom: 5px;" size=20vh color=#fff>mdi-arrow-down-thick</v-icon></v-col>
          <v-col></v-col>
        </v-row>
        <v-row style="height: 107px">
          <v-col></v-col>
          <v-col style="text-align: center; color: #636e72; font-size: 30px; font-weight: 300;">X / Y</v-col>
          <v-col></v-col>
        </v-row>
      </v-col>
      <v-col :sm="3">
        <v-row style="height: 107px">
          <v-col></v-col>
          <v-col v-ripple><v-icon style="margin-top: 5px;" size=20vh color=#fff>mdi-arrow-up-thick</v-icon></v-col>
          <v-col></v-col>
        </v-row>
        <v-row style="height: 107px">
          <v-col v-ripple></v-col>
          <v-col v-ripple></v-col>
          <v-col v-ripple></v-col>
        </v-row>
        <v-row style="height: 107px">
          <v-col></v-col>
          <v-col v-ripple><v-icon style="margin-bottom: 5px;" size=20vh color=#fff>mdi-arrow-down-thick</v-icon></v-col>
          <v-col></v-col>
        </v-row>
        <v-row style="height: 107px">
          <v-col></v-col>
          <v-col style="text-align: center; color: #636e72; font-size: 30px; font-weight: 300;">Z</v-col>
          <v-col></v-col>
        </v-row>
      </v-col>
      <v-col :sm="4" style="margin-top: 6vh;">
        <div class="control__detail-item">
          <v-row>
            <v-col :sm="4">
              <v-icon size=10vh color=#ff7675>mdi-printer-3d-nozzle</v-icon>
            </v-col>
            <v-col>
              <span class="control__detail-text">{{Math.round(printer.nozzle.actual)}}°C</span><br>
              <span class="control__detail-text-small">{{printer.nozzle.target}}°C</span>
            </v-col>
          </v-row>
        </div><br>
        <div class="control__detail-item">
          <v-row>
            <v-col :sm="4">
              <v-icon size=10vh color=#00b894>mdi-radiator</v-icon>
            </v-col>
            <v-col>
              <span class="control__detail-text">{{Math.round(printer.bed.actual)}}°C</span><br>
              <span class="control__detail-text-small">{{printer.bed.target}}°C</span>
            </v-col>
          </v-row>
        </div><br>
        <div class="control__detail-item">
          <v-row>
            <v-col :sm="4">
              <v-icon size=10vh color=#0984e3>mdi-fan</v-icon>
            </v-col>
            <v-col>
              <span class="control__detail-text" style="margin-top: 7px;">{{Math.round(printer.fan.speed)}}%</span>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {OctoprintAPI} from '../../octoprint-api/api.ts'
  import {config} from "../../config.ts"

  export default Vue.extend({
    name: 'Control',
    mixins: [OctoprintAPI],
    mounted: function() {
      this.update()
      this.printer.name = config.printerName
      setInterval(this.update, 2500);
    },
    methods: {
      formatTimeRemaining: function(remainingSeconds) {
        return window.moment("2015-01-01").startOf('day')
          .seconds(remainingSeconds)
          .format('H:mm');
      },
      update: function() {
        this.getJobStatus().then((data) => {
          this.printer.state = data.state
          if(data.state == "Printing" || data.state == "Starting") {
            this.$router.push("/now-printing");
          }
        })
        this.getLayerStatus().then((data) => {
          if(data.fanSpeed == "-") {
            this.printer.fan.speed = 0
          } else {
            this.printer.fan.speed = parseInt(data.fanSpeed.split("%")[0])
          }
        })
        this.getPrinterStatus().then((data) => {
          this.printer.nozzle.target = data.temperature.tool0.target
          this.printer.nozzle.actual = data.temperature.tool0.actual
          this.printer.bed.target = data.temperature.bed.target
          this.printer.bed.actual = data.temperature.bed.actual
        })
      }
    },
    data: function() {
      return {
        printer: {
          name: "",
          state: "",
          nozzle: {
            target: 0,
            actual: 0
          },
          bed: {
            target: 0,
            actual: 0
          },
          fan: {
            speed: 0
          }
        }
      };
    }
  })
</script>
