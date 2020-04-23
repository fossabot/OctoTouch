<style lang="sass">
  @import "NowPrinting.scss"
</style>

<template>
  <div fill-height fluid class="now-printing__container">
    <v-row class="now-printing__header">
      <v-col class="now-printing__header-item" align="start">
        <span style="float: left; margin-left: 5vw">{{printer.name}}</span>
      </v-col>
      <v-col class="now-printing__header-item" align="center">
        Layer <span class="now-printing__layer-current">{{job.currentLayer}}</span> of {{job.totalLayers}}
      </v-col>
      <v-col class="now-printing__header-item" align="end">
        <span style="float: right; margin-right: 5vw">{{printer.state}}</span>
      </v-col>
    </v-row>
    
    <!-- Progress Bar -->
    <div class="now-printing__progress" :class="{ 'paused' : (printer.state == 'Pausing' || printer.state == 'Paused')}" :style="'width: ' + (job.percentCompleted + 1) + 'vw;'"></div>
    <v-row class="now-printing__details">
      <v-col class="now-printing__progress-below" align="start">
        <span class="now-printing__details-percent">{{Math.floor(job.percentCompleted)}}%</span><br>
        <span class="now-printing__details-remaining"><v-icon size=30px color=white>mdi-clock</v-icon> {{formatTimeRemaining(job.timeRemaining)}}</span><br>
      </v-col>
      <v-col class="now-printing__progress-below now-printing__progress-details" style="color: white; font-size: 40px; line-height: 20px;" :sm="10" v-ripple align="end">
        <h1 class="now-printing__details-title">
          {{job.filename.replace("ADMFOR25EX_","").replace("LM_","").replace(".ufp", "").replace(/_/g, " ")}}
        </h1>
        <h3 class="now-printing__details-subtitle">
          {{job.filamentUsage[0]}}g <v-icon size=20px color=white>mdi-printer-3d-nozzle</v-icon><v-icon v-if="job.filamentUsage.length > 1" size=20px color=white>mdi-numeric-0-box</v-icon>
          <br v-if="job.filamentUsage.length > 1">
          <span v-if="job.filamentUsage.length > 1">{{job.filamentUsage[1]}}g <v-icon color=white>mdi-printer-3d-nozzle</v-icon><v-icon size=20px color=white>mdi-numeric-1-box</v-icon></span>
        </h3>
      </v-col>
    </v-row>

    <!-- Printing screen, links to UTILITIES, CANCEL, PAUSE -->
    <div class="now-printing__details" v-if="screen == 'printing'">
      <v-row class="now-printing__overview">
        <v-col class="now-printing__overview-item">
          <v-row>
            <v-col>
              <v-icon size=15vh color=#ff7675>mdi-printer-3d-nozzle</v-icon>
            </v-col>
            <v-col>
              <span class="now-printing__overview-text">{{Math.round(printer.nozzle.actual)}}°C</span><br>
              <span class="now-printing__overview-text-small">{{printer.nozzle.target}}°C</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="now-printing__overview-item">
          <v-row>
            <v-col>
              <v-icon size=15vh color=#00b894>mdi-radiator</v-icon>
            </v-col>
            <v-col>
              <span class="now-printing__overview-text">{{Math.round(printer.bed.actual)}}°C</span><br>
              <span class="now-printing__overview-text-small">{{printer.bed.target}}°C</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="now-printing__overview-item">
          <v-row>
            <v-col>
              <v-icon size=15vh color=#0984e3 spin>mdi-fan</v-icon>
            </v-col>
            <v-col>
              <span style="margin-top: 2.5vh;" class="now-printing__overview-text">{{printer.fan.speed}}%</span>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="now-printing__overview">
        <v-col @click="cancelDialog()" v-ripple class="now-printing__overview-item">
          <v-icon size=15vh color=#ff7675>mdi-cancel</v-icon>
        </v-col>
        <v-col @click="togglePause().then(function() {update()})" v-ripple class="now-printing__overview-item">
          <v-icon v-if="printer.state == 'Printing'" size=15vh color=#fdcb6e>mdi-pause</v-icon>
          <v-icon v-if="printer.state != 'Printing'" size=15vh color=#fdcb6e>mdi-play</v-icon>
        </v-col>
        <v-col @click="screen = 'utilities'" v-ripple class="now-printing__overview-item">
          <v-icon size=15vh color=#dfe6e9>mdi-cog</v-icon><br>
        </v-col>
      </v-row>
    </div>

    <div class="now-printing__details" v-if="screen == 'utilities'">
      <v-row class="now-printing__overview">
        <v-col @click="screen = 'printing'" v-ripple class="now-printing__overview-item">
          <v-icon size=15vh color=#dfe6e9>mdi-arrow-left</v-icon><br>
          <span style="color: #dfe6e9;">Back</span>
        </v-col>
        <v-col @click="screen = 'flowrate'" v-ripple class="now-printing__overview-item">
          <v-icon size=15vh color=#dfe6e9>mdi-cog-clockwise</v-icon><br>
          <span style="color: #dfe6e9;">Adjust Flowrate</span>
        </v-col>
        <v-col @click="screen = 'feedrate'" v-ripple class="now-printing__overview-item">
          <v-icon size=15vh color=#dfe6e9>mdi-speedometer</v-icon><br>
          <span style="color: #dfe6e9;">Print Speed</span>
        </v-col>
      </v-row>
      <v-row class="now-printing__overview">
        <v-col @click="overlay = 'tempAdjust-hotend'" v-ripple class="now-printing__overview-item">
          <v-icon size=15vh color=#dfe6e9>mdi-printer-3d-nozzle</v-icon><br>
          <span style="color: #dfe6e9;">Nozzle Temp</span>
        </v-col>
        <v-col @click="overlay = 'tempAdjust-heatedbed'" v-ripple class="now-printing__overview-item">
          <v-icon size=15vh color=#dfe6e9>mdi-radiator</v-icon><br>
          <span style="color: #dfe6e9;">Bed Temp</span>
        </v-col>
        <v-col @click="emergencyStop()" v-ripple class="now-printing__overview-item">
          <v-icon size=15vh color=#ff7675>mdi-stop-circle</v-icon><br>
          <span style="color: #ff7675;">Emergency Stop</span>
        </v-col>
      </v-row>
    </div>

    <!-- Utility menus, collapse when not working on -->
    <!-- these div tags are useless, only point is code folding :) -->
    <div>

      <!-- Flowrate adj. screen -->
      <div class="now-printing__details" v-if="screen == 'flowrate'">
        <v-row class="now-printing__overview">
          <v-col @click="screen = 'utilities'" v-ripple class="now-printing__overview-item">
            <v-icon size=15vh color=#dfe6e9>mdi-arrow-left</v-icon><br>
            <span style="color: #dfe6e9;">Back</span>
          </v-col>
          <v-col @click="screen = 'feedrate'" v-ripple class="now-printing__overview-item">
            <v-icon size=15vh color=#dfe6e9>mdi-speedometer</v-icon><br>
            <span style="color: #dfe6e9;">Bump Down</span>
          </v-col>
          <v-col @click="screen = 'flowrate'" v-ripple class="now-printing__overview-item">
            <v-icon size=15vh color=#dfe6e9>mdi-cog-clockwise</v-icon><br>
            <span style="color: #dfe6e9;">Bump Up</span>
          </v-col>
        </v-row>
      </div>

      <!-- Feedrate adj. screen -->
      <div class="now-printing__details" v-if="screen == 'feedrate'">
        <v-row class="now-printing__overview">
          <v-col @click="screen = 'utilities'" v-ripple class="now-printing__overview-item">
            <v-icon size=15vh color=#dfe6e9>mdi-arrow-left</v-icon><br>
            <span style="color: #dfe6e9;">Back</span>
          </v-col>
          <v-col @click="screen = 'feedrate'" v-ripple class="now-printing__overview-item">
            <v-icon size=15vh color=#dfe6e9>mdi-cog-counterclockwise</v-icon><br>
            <span style="color: #dfe6e9;">Bump Down</span>
          </v-col>
          <v-col @click="screen = 'flowrate'" v-ripple class="now-printing__overview-item">
            <v-icon size=15vh color=#dfe6e9>mdi-cog-clockwise</v-icon><br>
            <span style="color: #dfe6e9;">Bump Up</span>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Utility OVERLAYS, collapse when not working on -->
    <!-- these div tags are useless, only point is code folding :) -->
    <div>
      <div :if="overlay == 'tempAdjust-hotend'" style="position: fixed; top: 0%; left: 0%; width: 100vw; height: 100vh; background-color: #f00;">
      </div> 
    </div>

    <div class="now-printing__details now-printing__dialog" v-if="screen == 'dialog'">
      <h1 class="now-printing__dialog-title">{{currentDialog.title}}</h1>
      <v-row class="now-printing__dialog-actions">
        <v-col @click="action.action" class="now-printing__dialog-action" :class="goodOrBad(action)" v-ripple v-for="action in currentDialog.actions" v-bind:key="action.action">
          <v-icon :color="goodOrBadIcon(action)" size=15vh>{{action.icon}}</v-icon><br>
          <span>{{action.text}}</span>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {OctoprintAPI} from '../../octoprint-api/api.ts'
  import {config} from "../../config.ts"
  export default Vue.extend({
    name: 'NowPrinting',
    mixins: [OctoprintAPI],
    mounted: function() {
      this.update()
      this.updateInterval = setInterval(this.update, 2500);
    },
    methods: {
      formatTimeRemaining: function(remainingSeconds) {
        return window.moment("2015-01-01").startOf('day')
          .seconds(remainingSeconds)
          .format('H:mm');
      },
      showDialog: function(title, actions) {
        this.oldScreen = this.screen
        this.screen = "dialog"
        this.currentDialog.title = title
        this.currentDialog.actions = actions
      },
      cancelDialog: function() {
        this.showDialog("Are you sure?", [
          {
            text: "Cancel Print",
            icon: "mdi-stop-circle",
            color: "red",
            action: this.cancelPrint
          }, 
          {
            text: "Back",
            icon: "mdi-arrow-left",
            color: "neutral",
            action: () => {
              this.screen = this.oldScreen
              this.oldScreen = this.screen
            }
          }, 
        ])
      },
      update: function() {
        this.getJobStatus().then((data) => {
          this.printer.state = data.state
          if(data.state == "Operational" || data.state == "Cancelling") {
            this.$router.push("/");
          }
          this.printer.name = config.printerName
          this.job.percentCompleted = data.progress.completion
          this.job.filename = data.job.file.name
          this.job.timeRemaining = data.progress.printTimeLeft
          this.job.filamentUsage[0] = this.lengthToWeight(data.job.filament.tool0.length)
          if(data.job.filament.tool1 != undefined) {
            this.job.filamentUsage[1] = this.lengthToWeight(data.job.filament.tool1.length)
          }
        })
        this.getLayerStatus().then((data) => {
          this.job.currentLayer = data.layer.current
          this.job.totalLayers = data.layer.total
          if(data.fanSpeed == "-" || data.fanSpeed == "Off") {
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
      },
      goodOrBad: function(action) {
        if(action.color == "red") {
          return "now-printing__dialog-action-bad"
        } else if(action.color == "green") {
          return "now-printing__dialog-action-good"
        } else {
          return "now-printing__dialog-action-neutral"
        }
      },
      goodOrBadIcon: function(action) {
        if(action.color == "red") {
          return "#ff7675"
        } else if(action.color == "green") {
          return "#55efc4"
        } else {
          return "#dfe6e9"
        }
      }
    },
    computed: {
      pauseOrPlay: function() {
        if(this.printer.state == "Pausing" || this.printer.state == "Paused") {
          return "Resume Print"
        } else {
          return "Pause Print"
        }
      }
    },
    data: function() {
      return {
        screen: "printing",
        overlay: "tempAdjust-hotend",
        oldScreen: "",
        currentDialog: {
          title: "",
          actions: []
        },
        job: {
          percentCompleted: 0,
          filename: "",
          filamentUsage: [],
          timeRemaining: 0,
          currentLayer: 0,
          totalLayers: 0
        },
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
