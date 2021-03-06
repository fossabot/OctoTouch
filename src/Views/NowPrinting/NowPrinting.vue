<style lang="sass">
@import "NowPrinting.scss"
</style>

<template>
    <div fill-height fluid class="container">
        <v-row class="header">
            <v-col class="header-item" align="start">
                {{ printer.name }}
            </v-col>
            <v-col class="header-item" align="center">
                <v-icon size="30px" color="#fff">mdi-printer-3d</v-icon>
            </v-col>
            <v-col class="header-item" align="end">
                <transition name="fade" mode="out-in">
                    <span style="font-weight: 300;" v-if="currentHeader == 1"
                        >Layer <span class="now-printing__layer-current">{{ job.currentLayer }}</span> of {{ job.totalLayers }}</span
                    >
                    <p style="font-weight: 300;" v-if="currentHeader == 2">{{ job.eta }}</p>
                </transition>
            </v-col>
        </v-row>

        <!-- Progress Bar -->
        <div
            class="now-printing__progress"
            :class="{ paused: printer.state == 'Pausing' || printer.state == 'Paused', barberpole: true }"
            :style="'width: ' + (job.percentCompleted + 1) + 'vw;'"
        ></div>
        <v-row class="now-printing__details">
            <v-col v-if="printer.isHeating == false && printer.isCooling == false" class="now-printing__progress-below" align="start" :sm="2">
                <span class="now-printing__details-percent">{{ Math.round(job.percentCompleted) }}%</span><br />
                <span class="now-printing__details-remaining"><v-icon style="margin-top: -0.7vh;" size="30px" color="white">mdi-clock</v-icon> {{ formatTimeRemaining(job.timeRemaining) }}</span
                ><br />
            </v-col>
            <v-col v-if="printer.isHeating == true || printer.isCooling == true" class="now-printing__progress-below" align="start" :sm="2">
                <span v-if="printer.isHeating == true" class="now-printing__details-percent">Heating</span>
                <span v-if="printer.isCooling == true" class="now-printing__details-percent">Cooling</span><br />
                <span class="now-printing__details-remaining" style="font-size: 20px;">Please wait</span><br />
            </v-col>
            <v-col
                @click="overlay = 'print-picture'"
                class="now-printing__progress-below now-printing__progress-details"
                style="color: white; font-size: 40px; line-height: 20px;"
                :sm="10"
                v-ripple
                align="end"
            >
                <h1 class="now-printing__details-title">
                    {{ formatFileName(job.filename) }}
                </h1>
                <h3 class="now-printing__details-subtitle">
                    {{ job.filamentUsage[0] }}g <v-icon size="20px" color="white">mdi-printer-3d-nozzle</v-icon
                    ><v-icon v-if="job.filamentUsage.length > 1" size="20px" color="white">mdi-numeric-0-box</v-icon>
                    <br v-if="job.filamentUsage.length > 1" />
                    <span v-if="job.filamentUsage.length > 1"
                        >{{ job.filamentUsage[1] }}g <v-icon color="white">mdi-printer-3d-nozzle</v-icon><v-icon size="20px" color="white">mdi-numeric-1-box</v-icon></span
                    >
                </h3>
            </v-col>
        </v-row>

        <!-- Printing screen, links to UTILITIES, CANCEL, PAUSE -->
        <div class="now-printing__details" v-if="screen == 'printing'">
            <v-row class="now-printing__overview">
                <v-col v-ripple @click="overlay = 'tempAdjust-hotend'" class="now-printing__overview-item">
                    <v-row>
                        <v-col>
                            <v-icon size="15vh" color="#ff7675">mdi-printer-3d-nozzle</v-icon>
                        </v-col>
                        <v-col>
                            <span class="now-printing__overview-text">{{ Math.round(printer.nozzle.actual) }}<span style="font-size: 20px;">°C</span></span
                            ><br />
                            <span class="now-printing__overview-text-small">{{ printer.nozzle.target }}°C</span>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col v-ripple @click="overlay = 'tempAdjust-heatedbed'" class="now-printing__overview-item">
                    <v-row>
                        <v-col>
                            <v-icon size="15vh" color="#00b894">mdi-radiator</v-icon>
                        </v-col>
                        <v-col>
                            <span class="now-printing__overview-text">{{ Math.round(printer.bed.actual) }}<span style="font-size: 20px;">°C</span></span
                            ><br /><br />
                            <span class="now-printing__overview-text-small" style="margin-top: -20px;">{{ printer.bed.target }}°C</span>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col class="now-printing__overview-item">
                    <v-row>
                        <v-col>
                            <v-icon size="15vh" :class="spinning" color="#0984e3" spin>mdi-fan</v-icon>
                        </v-col>
                        <v-col>
                            <span style="margin-top: 2.5vh;" class="now-printing__overview-text">{{ printer.fan.speed }}<span style="font-size: 20px;">%</span></span>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-row class="now-printing__overview">
                <v-col @click="cancelDialog()" v-ripple class="now-printing__overview-item">
                    <v-icon size="15vh" color="#ff7675">mdi-close-circle</v-icon>
                </v-col>
                <v-col
                    @click="
                        togglePause().then(function () {
                            update()
                        })
                    "
                    v-ripple
                    class="now-printing__overview-item"
                >
                    <v-icon v-if="printer.state == 'Printing'" size="15vh" color="#fdcb6e">mdi-pause-circle</v-icon>
                    <v-icon v-if="printer.state == 'Paused'" size="15vh" color="#fdcb6e">mdi-play-circle</v-icon>
                    <v-icon v-if="printer.state == 'Pausing' || printer.state == 'Resuming'" size="15vh" color="#fdcb6e">mdi-dots-horizontal-circle</v-icon>
                </v-col>
                <v-col @click="screen = 'utilities'" v-ripple class="now-printing__overview-item"> <v-icon size="15vh" color="#dfe6e9">mdi-cog</v-icon><br /> </v-col>
            </v-row>
        </div>

        <!-- Utility menus, collapse when not working on -->
        <!-- these div tags are useless, only point is code folding :) -->
        <transition name="fade">
            <!-- Main screen -->
            <div class="now-printing__details" v-if="screen == 'utilities'">
                <v-row class="now-printing__overview">
                    <v-col @click="screen = 'printing'" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#dfe6e9">mdi-arrow-left</v-icon><br />
                        <span style="color: #dfe6e9;">Back</span>
                    </v-col>
                    <v-col @click="screen = 'flowrate'" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#dfe6e9">mdi-cog-clockwise</v-icon><br />
                        <span style="color: #dfe6e9;">Adjust Flowrate</span>
                    </v-col>
                    <v-col @click="screen = 'feedrate'" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#dfe6e9">mdi-speedometer</v-icon><br />
                        <span style="color: #dfe6e9;">Print Speed</span>
                    </v-col>
                </v-row>
                <v-row class="now-printing__overview">
                    <v-col @click="emergencyStop()" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#ff7675">mdi-stop-circle</v-icon><br />
                        <span style="color: #ff7675;">Emergency Stop</span>
                    </v-col>
                </v-row>
            </div>

            <!-- Flowrate adj. screen -->
            <div class="now-printing__details" v-if="screen == 'flowrate'">
                <v-row class="now-printing__overview">
                    <v-col @click="screen = 'utilities'" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#dfe6e9">mdi-arrow-left</v-icon><br />
                        <span style="color: #dfe6e9;">Back</span>
                    </v-col>
                    <v-col @click="screen = 'feedrate'" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#dfe6e9">mdi-speedometer</v-icon><br />
                        <span style="color: #dfe6e9;">Bump Down</span>
                    </v-col>
                    <v-col @click="screen = 'flowrate'" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#dfe6e9">mdi-cog-clockwise</v-icon><br />
                        <span style="color: #dfe6e9;">Bump Up</span>
                    </v-col>
                </v-row>
            </div>

            <!-- Feedrate adj. screen -->
            <div class="now-printing__details" v-if="screen == 'feedrate'">
                <v-row class="now-printing__overview">
                    <v-col @click="screen = 'utilities'" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#dfe6e9">mdi-arrow-left</v-icon><br />
                        <span style="color: #dfe6e9;">Back</span>
                    </v-col>
                    <v-col @click="screen = 'feedrate'" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#dfe6e9">mdi-cog-counterclockwise</v-icon><br />
                        <span style="color: #dfe6e9;">Bump Down</span>
                    </v-col>
                    <v-col @click="screen = 'flowrate'" v-ripple class="now-printing__overview-item">
                        <v-icon size="15vh" color="#dfe6e9">mdi-cog-clockwise</v-icon><br />
                        <span style="color: #dfe6e9;">Bump Up</span>
                    </v-col>
                </v-row>
            </div>
        </transition>

        <!-- Utility OVERLAYS, collapse when not working on -->
        <!-- these div tags are useless, only point is code folding :) -->
        <div>
            <transition name="fade">
                <div @click.self="overlay = ''" v-if="overlay == 'print-picture'" class="modal-container">
                    <div class="modal-wrapper">
                        <img style="width: 35vw;" :src="ufpPreviewURL(job.filepath)" />
                    </div>
                </div>
                <quick-adjust v-if="overlay == 'tempAdjust-hotend'" :value="printer.nozzle.target" v-on:close="overlay = ''" v-on:setValue="setNozzleTemp"></quick-adjust>
                <quick-adjust v-if="overlay == 'tempAdjust-heatedbed'" :value="printer.bed.target" v-on:close="overlay = ''" v-on:setValue="setBedTemp"></quick-adjust>
                <div class="now-printing__details now-printing__dialog" v-if="screen == 'dialog'">
                    <h1 class="now-printing__dialog-title">{{ currentDialog.title }}</h1>
                    <v-row class="now-printing__dialog-actions">
                        <v-col @click="action.action" class="now-printing__dialog-action" :class="goodOrBad(action)" v-ripple v-for="action in currentDialog.actions" v-bind:key="action.action">
                            <v-icon :color="goodOrBadIcon(action)" size="15vh">{{ action.icon }}</v-icon
                            ><br />
                            <span>{{ action.text }}</span>
                        </v-col>
                    </v-row>
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { OctoPrint } from "@/Mixins/OctoPrint"
import { Config as config } from "@/Mixins/Config"
import QuickAdjust from "@/Components/QuickAdjust/QuickAdjust.vue"
const moment = require("moment")

export default Vue.extend({
    name: "NowPrinting",
    mixins: [OctoPrint],
    mounted: function () {
        this.update()
        this.updateInterval = setInterval(this.update, 2500)
    },
    methods: {
        formatTimeRemaining: function (remainingSeconds) {
            return moment("2015-01-01").startOf("day").seconds(remainingSeconds).format("H:mm")
        },
        showDialog: function (title, actions) {
            this.oldScreen = this.screen
            this.screen = "dialog"
            this.currentDialog.title = title
            this.currentDialog.actions = actions
        },
        cancelDialog: function () {
            this.showDialog("Are you sure?", [
                {
                    text: "",
                    icon: "mdi-arrow-left",
                    color: "neutral",
                    action: () => {
                        this.screen = this.oldScreen
                        this.oldScreen = this.screen
                    },
                },
                {
                    text: "Cancel Print",
                    icon: "mdi-close-circle",
                    color: "red",
                    action: () => {
                        this.cancelPrint()
                    },
                },
            ])
        },
        ufpPreviewURL: function (file) {
            return config.baseURL.replace("/api/", "") + "/plugin/UltimakerFormatPackage/thumbnail/" + file.replace(".ufp.gcode", ".png")
        },
        nozzleOffset: function (temp) {
            if (this.printer.nozzle.target + temp >= 0 && this.printer.nozzle.target + temp <= 275) {
                this.printer.nozzle.target = this.printer.nozzle.target + temp
            }
            this.setNozzleTemp(this.printer.nozzle.target).then(() => {
                this.update()
            })
        },
        bedOffset: function (temp) {
            if (this.printer.bed.target + temp >= 0 && this.printer.bed.target + temp <= 275) {
                this.printer.bed.target = this.printer.bed.target + temp
            }
            this.setBedTemp(this.printer.bed.target).then(() => {
                this.update()
            })
        },
        update: function () {
            this.loop = this.loop + 1
            if (this.loop == 5) {
                if (this.currentHeader == 1) {
                    this.currentHeader = 2
                } else {
                    this.currentHeader = 1
                }
                this.loop = 1
            }
            this.getPrinterStatus()
                .then((data) => {
                    this.printer.nozzle.target = data.temperature.tool0.target
                    this.printer.nozzle.actual = data.temperature.tool0.actual
                    this.printer.bed.target = data.temperature.bed.target
                    this.printer.bed.actual = data.temperature.bed.actual

                    if (Math.abs(this.printer.nozzle.actual - this.printer.nozzle.target) > 10 || Math.abs(this.printer.bed.actual - this.printer.bed.target) > 3) {
                        this.printer.isHeating = true
                    } else {
                        this.printer.isHeating = false
                        this.printer.isCooling = false
                    }
                })
                .then(() => {
                    this.getJobStatus().then((data) => {
                        this.printer.state = data.state
                        if (data.state == "Operational" || data.state == "Cancelling") {
                            this.goto("/")
                        }
                        this.printer.name = config.printerName
                        if (this.printer.isHeating == true || this.printer.isCooling == true) {
                            this.job.percentCompleted = 100
                        } else {
                            this.job.percentCompleted = data.progress.completion
                        }
                        this.job.filename = data.job.file.name
                        this.job.filepath = data.job.file.path
                        this.job.timeRemaining = data.progress.printTimeLeft
                        const epochComplete = moment().valueOf() + this.job.timeRemaining * 1000
                        this.job.eta = moment(epochComplete).calendar()
                        this.job.filamentUsage[0] = this.lengthToWeight(data.job.filament.tool0.length)
                        if (data.job.filament.tool1 != undefined) {
                            this.job.filamentUsage[1] = this.lengthToWeight(data.job.filament.tool1.length)
                        }
                    })
                })
            this.getLayerStatus().then((data) => {
                this.job.currentLayer = data.layer.current
                this.job.totalLayers = data.layer.total
                if (data.fanSpeed == "-" || data.fanSpeed == "Off") {
                    this.printer.fan.speed = 0
                } else {
                    this.printer.fan.speed = parseInt(data.fanSpeed.split("%")[0])
                }
            })
        },
        goodOrBad: function (action) {
            if (action.color == "red") {
                return "now-printing__dialog-action-bad"
            } else if (action.color == "green") {
                return "now-printing__dialog-action-good"
            } else {
                return "now-printing__dialog-action-neutral"
            }
        },
        goodOrBadIcon: function (action) {
            if (action.color == "red") {
                return "#ff7675"
            } else if (action.color == "green") {
                return "#55efc4"
            } else {
                return "#dfe6e9"
            }
        },
    },
    computed: {
        pauseOrPlay: function () {
            if (this.printer.state == "Pausing" || this.printer.state == "Paused") {
                return "Resume Print"
            } else {
                return "Pause Print"
            }
        },
        spinning: function () {
            if (this.printer.fan.speed > 0) {
                return "spin"
            } else {
                return ""
            }
        },
    },
    data: function () {
        return {
            loop: 0,
            screen: "printing",
            overlay: "",
            oldScreen: "",
            currentDialog: {
                title: "",
                actions: [],
            },
            currentHeader: 1,
            job: {
                percentCompleted: 0,
                filename: "",
                filepath: "",
                eta: "",
                filamentUsage: [],
                timeRemaining: 0,
                currentLayer: 0,
                totalLayers: 0,
            },
            printer: {
                name: "",
                isHeating: false,
                isCooling: false,
                state: "",
                nozzle: {
                    target: 0,
                    actual: 0,
                },
                bed: {
                    target: 0,
                    actual: 0,
                },
                fan: {
                    speed: 0,
                },
            },
        }
    },
    components: {
        "quick-adjust": QuickAdjust,
    },
})
</script>
