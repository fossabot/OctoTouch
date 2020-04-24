<style lang="sass">
  @import "Files.scss"
</style>

<template>
  <div fill-height fluid class="files__container">
    <v-row class="header">
      <v-col @click="goto('/')" class="header-item" align="start">
        <span style="float: left; margin-left: 2vw"><v-icon style="margin-top: -3px" color=#fff size=40px>mdi-arrow-left-circle-outline</v-icon></span>
      </v-col>
      <v-col class="header-item" align="center">
        <v-icon style="margin-top: -3px;" size=40px color=#fff>mdi-folder-multiple-outline</v-icon>
      </v-col>
      <v-col class="header-item" align="end">
        <span style="float: right; margin-right: 5vw">{{printer.name}}</span>
      </v-col>
    </v-row>
    <div class="files__files">
      <div class="files__file" @click="openFile(file)" v-for="(file, idx) in files" v-bind:key="idx">
        <div class="files__file-image">
          <img :src="ufpPreviewURL(file)">
        </div>
        <div class="files__file-information">
          <p class="files__file-name">{{file.name.replace("ADMFOR25EX_","").replace(".ufp","").replace(".gcode", "")}}</p>
        </div>
      </div>
    </div>

    <!-- file modal -->
    <transition name="fade">
      <div class="modal-container" @click.self="viewingFile = false" v-if="viewingFile == true">
        <div class="modal-wrapper">
          <div class="modal-header">
            <span class="modal-title">File Details</span>
            <span @click="viewingFile = false" class="modal-close"><v-icon color=#d63031>mdi-close-circle</v-icon></span>
          </div>
          <div class="modal-body">
            <div class="files__file-image">
              <img :src="ufpPreviewURL(fileBeingViewed)">
            </div>
            <div class="files__file-information">
              <p class="files__file-popup__name">{{fileBeingViewed.name.replace("ADMFOR25EX_","").replace(".ufp","").replace(".gcode", "")}}</p>
              <div class="files__file-popup__stats">
                <div class="files__file-popup__stat">
                  {{(fileBeingViewed.size / 1000000).toFixed(1)}}<span class="files__file-popup__stat-small">mb</span>
                </div>
                <div class="files__file-popup__stat">
                  {{formatTimeRemaining(fileBeingViewed.gcodeAnalysis.estimatedPrintTime)}}<span class="files__file-popup__stat-small">h</span>
                </div>
                <div class="files__file-popup__stat">
                  {{lengthToWeight(fileBeingViewed.gcodeAnalysis.filament.tool0.length)}}<span class="files__file-popup__stat-small">g</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {OctoprintAPI} from '../../octoprint-api/api.ts'
  import {config} from "../../config.ts"

  export default Vue.extend({
    name: 'Files',
    mixins: [OctoprintAPI],
    mounted: function() {
      this.update()
      this.printer.name = config.printerName
      this.updateInterval = setInterval(this.update, 2500);

      //Retrieve files and display on page...
      this.getFiles().then((data) => {
        data.forEach((e,i) => {
          console.log(e)
          if(e.type == "machinecode") {
            this.files.push(e)
            console.log(this.files)
          } else {
            console.log("Folders not supported yet... :(")
          }
        })
        this.openFile(this.files[0]);
      })
    },
    methods: {
      openFile: function(file) {
        this.fileBeingViewed = file;
        this.viewingFile = true;
      },
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
      },
      ufpPreviewURL: function(file) {
        return config.baseURL.replace('/api/', '') + '/plugin/UltimakerFormatPackage/thumbnail/' + file.name.replace('.ufp.gcode','.png')
      }
    },
    computed: {
    },
    data: function() {
      return {
        printer: {
          name: "",
          state: ""
        },
        freeSpace: "",
        files: [],
        viewingFile: false,
        fileBeingViewed: null
      };
    }
  })
</script>
