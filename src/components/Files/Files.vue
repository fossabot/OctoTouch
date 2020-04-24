<style lang="sass">
  @import "Files.scss"
</style>

<template>
  <div fill-height fluid class="container">
    <v-row class="header">
      <v-col @click="goto('/')" class="header-item" align="start">
        <span style="float: left; margin-left: 2vw"><v-icon style="margin-top: -3px" color=#fff size=40px>mdi-arrow-left-circle-outline</v-icon></span>
      </v-col>
      <v-col class="header-item" align="center">
        <v-icon style="margin-top: -3px;" size=40px color=#fff>mdi-folder-multiple</v-icon>
      </v-col>
      <v-col class="header-item" align="end">
        <span style="float: right; margin-right: 5vw">{{printer.name}}</span>
      </v-col>
    </v-row>

    <!-- file list -->
    <div class="files__files">
      <div class="files__file" @click="openFile(file)" v-for="(file, idx) in files" v-bind:key="idx">
        <div v-if="file.type == 'machinecode'">
          <div class="files__file-image">
            <img :src="ufpPreviewURL(file)">
          </div>
          <div class="files__file-information">
            <p class="files__file-name"><v-icon color=#fff>mdi-cube-outline</v-icon> {{file.name.replace("ADMFOR25EX_","").replace(".ufp","").replace(".gcode", "")}}</p>
          </div>
        </div>
        <div v-if="file.type == 'folder'">
          <div class="files__file-image">
            <v-icon size=110px color=#2d3436>mdi-folder</v-icon>
          </div>
          <div class="files__file-information">
            <p class="files__file-name"><v-icon color=#fff>mdi-printer-3d</v-icon> {{file.name}}</p>
          </div>
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
              <div class="files__file-popup__actions">
                <div class="files__file-popup__action" v-ripple @click="printFile(fileBeingViewed).then(() => { update(); viewingFile = false })">
                  <v-icon color=#00b894 size=40px>mdi-printer-3d</v-icon>
                </div>
                <div class="files__file-popup__action" v-ripple @click="deleteFile(fileBeingViewed).then(() => { update(); viewingFile = false })">
                  <v-icon color=#ff7675 size=40px>mdi-delete</v-icon>
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
  import {OctoprintAPI} from '../../octoprint-api/api'
  import {config} from "../../config"
  declare var moment

  export default Vue.extend({
    name: 'Files',
    mixins: [OctoprintAPI],
    mounted: function() {
      this.update()
      this.printer.name = config.printerName
      this.updateInterval = setInterval(this.update, 2500);

      //Retrieve files and display on page...
      this.getFiles().then((data) => {
        this.files = []
        data.forEach((e,i) => {
          this.files.push(e)
        })
        //this.openFile(this.files[1]);
      })
    },
    methods: {
      openFile: function(file) {
        this.fileBeingViewed = file;
        this.viewingFile = true;
      },
      formatTimeRemaining: function(remainingSeconds) {
        return moment("2015-01-01").startOf('day')
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
        this.getFiles().then((data) => {
          this.files = []
          data.forEach((e,i) => {
            this.files.push(e)
          })
          //this.openFile(this.files[1]);
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
