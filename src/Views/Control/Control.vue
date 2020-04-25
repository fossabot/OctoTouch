<style lang="sass">
@import "Control.scss"
</style>

<template>
    <div fill-height fluid class="container">
        <v-row class="header">
            <v-col @click="goto('/')" class="header-item" align="start">
                <span style="float: left; margin-left: 2vw;"><v-icon style="margin-top: -3px;" color="#fff" size="40px">mdi-arrow-left-circle-outline</v-icon></span>
            </v-col>
            <v-col class="header-item" align="center">
                <v-icon style="margin-top: -3px;" size="40px" color="#fff">mdi-google-controller</v-icon>
            </v-col>
            <v-col class="header-item" align="end">
                <span style="float: right; margin-right: 5vw;">{{ printer.name }}</span>
            </v-col>
        </v-row>
        <v-row class="control__content">
            <v-col :sm="5" class="control__directional-pad">
                <v-row style="height: 107px;">
                    <v-col></v-col>
                    <v-col v-ripple @click="jog('y', 10)"><v-icon style="margin-top: 5px;" size="20vh" color="#fff">mdi-arrow-up-thick</v-icon></v-col>
                    <v-col></v-col>
                </v-row>
                <v-row style="height: 107px;">
                    <v-col @click="jog('x', -10)" v-ripple><v-icon size="20vh" color="#fff">mdi-arrow-left-thick</v-icon></v-col>
                    <v-col @click="action('home')" v-ripple><v-icon style="margin: auto; top: 15%; width: 7vw;" size="14vh" color="#fff">mdi-home</v-icon></v-col>
                    <v-col @click="jog('x', 10)" v-ripple><v-icon size="20vh" color="#fff">mdi-arrow-right-thick</v-icon></v-col>
                </v-row>
                <v-row style="height: 107px;">
                    <v-col></v-col>
                    <v-col @click="jog('y', -10)" v-ripple><v-icon style="margin-bottom: 5px;" size="20vh" color="#fff">mdi-arrow-down-thick</v-icon></v-col>
                    <v-col></v-col>
                </v-row>
                <v-row style="height: 107px;">
                    <v-col></v-col>
                    <v-col style="text-align: center; color: #636e72; font-size: 30px; font-weight: 300;">X / Y</v-col>
                    <v-col></v-col>
                </v-row>
            </v-col>
            <v-col :sm="3">
                <v-row style="height: 107px;">
                    <v-col></v-col>
                    <v-col @click="jog('z', 10)" v-ripple><v-icon style="margin-top: 5px;" size="20vh" color="#fff">mdi-arrow-up-thick</v-icon></v-col>
                    <v-col></v-col>
                </v-row>
                <v-row style="height: 107px;">
                    <v-col v-ripple></v-col>
                    <v-col v-ripple></v-col>
                    <v-col v-ripple></v-col>
                </v-row>
                <v-row style="height: 107px;">
                    <v-col></v-col>
                    <v-col @click="jog('z', -10)" v-ripple><v-icon style="margin-bottom: 5px;" size="20vh" color="#fff">mdi-arrow-down-thick</v-icon></v-col>
                    <v-col></v-col>
                </v-row>
                <v-row style="height: 107px;">
                    <v-col></v-col>
                    <v-col style="text-align: center; color: #636e72; font-size: 30px; font-weight: 300;">Z</v-col>
                    <v-col></v-col>
                </v-row>
            </v-col>
            <v-col :sm="4" style="margin-top: 3vh; padding-right: 5vw;">
                <div class="control__detail-item">
                    <v-row v-ripple @click="overlay = 'tempAdjust-hotend'">
                        <v-col :sm="4">
                            <v-icon size="15vh" color="#ff7675">mdi-printer-3d-nozzle</v-icon>
                        </v-col>
                        <v-col style="margin-top: 2vh;">
                            <span class="control__detail-text">{{ Math.round(printer.nozzle.actual) }}°C</span><br />
                            <span class="control__detail-text-small">{{ printer.nozzle.target }}°C</span>
                        </v-col>
                    </v-row>
                </div>
                <br />
                <div class="control__detail-item">
                    <v-row v-ripple @click="overlay = 'tempAdjust-heatedbed'">
                        <v-col :sm="4">
                            <v-icon size="15vh" color="#00b894">mdi-radiator</v-icon>
                        </v-col>
                        <v-col style="margin-top: 2vh;">
                            <span class="control__detail-text">{{ Math.round(printer.bed.actual) }}°C</span><br />
                            <span class="control__detail-text-small">{{ printer.bed.target }}°C</span>
                        </v-col>
                    </v-row>
                </div>
                <br />
                <div class="control__detail-item">
                    <v-row>
                        <v-col :sm="4">
                            <v-icon size="15vh" :class="spinning" color="#0984e3">mdi-fan</v-icon>
                        </v-col>
                        <v-col style="margin-top: 3vh;">
                            <span class="control__detail-text" style="margin-top: 7px;">{{ Math.round(printer.fan.speed) }}%</span>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
        <div>
            <transition name="fade">
                <quick-adjust v-if="overlay == 'tempAdjust-hotend'" :value="printer.nozzle.target" v-on:close="overlay = ''" v-on:setValue="setNozzleTemp"></quick-adjust>
                <quick-adjust v-if="overlay == 'tempAdjust-heatedbed'" :value="printer.bed.target" v-on:close="overlay = ''" v-on:setValue="setBedTemp"></quick-adjust>
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
    name: "Control",
    mixins: [OctoPrint],
    mounted: function () {
        this.update()
        this.printer.name = config.printerName
        this.updateInterval = setInterval(this.update, 2000)
    },
    methods: {
        formatTimeRemaining: function (remainingSeconds) {
            return moment("2015-01-01").startOf("day").seconds(remainingSeconds).format("H:mm")
        },
        update: function () {
            this.getJobStatus().then((data) => {
                this.printer.state = data.state
                if (data.state == "Printing" || data.state == "Starting") {
                    this.$router.push("/now-printing")
                }
            })
            this.getLayerStatus().then((data) => {
                if (data.fanSpeed == "-" || data.fanSpeed == "Off") {
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
    },
    computed: {
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
            overlay: "",
            printer: {
                name: "",
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
