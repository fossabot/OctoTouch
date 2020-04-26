<style lang="sass">
@import "MainScreen.scss"
</style>

<template>
    <div @click="resetTimeout()" fill-height fluid class="container">
        <v-row class="header" align="center" justify="center">
            <v-col class="header-item" align="start">
                {{ printer.name }}
            </v-col>
            <v-col class="header-item" align="center">
                {{ Math.round(printer.nozzle.actual) }}°C <v-icon style="margin-right: 12px; margin-top: -4px;" color="#fff" size="20px">mdi-printer-3d-nozzle</v-icon
                >{{ Math.round(printer.bed.actual) }}°C <v-icon color="#fff" style="margin-top: -4px;" size="20px">mdi-radiator</v-icon>
            </v-col>
            <v-col class="header-item" align="end">
                {{ printer.state }}
            </v-col>
        </v-row>
        <v-row class="main-menu__row" align="center" justify="center">
            <v-col @click="goto('/files')" v-ripple class="main-menu__item">
                <v-icon color="#fff" size="10vw" class="main-menu__item-icon">mdi-folder-multiple</v-icon><br />
                <span class="main-menu__item-title">files</span>
            </v-col>
            <v-col @click="goto('/filament')" v-ripple class="main-menu__item">
                <v-icon color="#fff" size="10vw" class="main-menu__item-icon">mdi-dolly</v-icon><br />
                <span class="main-menu__item-title">materials</span>
            </v-col>
        </v-row>
        <v-row class="main-menu__row" align="center" justify="center">
            <v-col @click="goto('/control')" v-ripple class="main-menu__item">
                <v-icon color="#fff" size="10vw" class="main-menu__item-icon">mdi-google-controller</v-icon><br />
                <span class="main-menu__item-title">control</span>
            </v-col>
            <v-col @click="goto('/utilities')" v-ripple class="main-menu__item">
                <v-icon color="#fff" size="10vw" class="main-menu__item-icon">mdi-cogs</v-icon><br />
                <span class="main-menu__item-title">utilities</span>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { OctoPrint } from "@/Mixins/OctoPrint"
import { Config as config } from "@/Mixins/Config"
import { Helpers } from "@/Mixins/Helpers"

export default Vue.extend({
    name: "MainScreen",
    mixins: [OctoPrint, Helpers],
    mounted: function () {
        this.printer.name = config.printerName
        this.update()
        this.updateInterval = setInterval(this.update, 2500)
    },
    methods: {
        resetTimeout: function () {
            return 1
        },
        update: function () {
            this.getPrinterStatus().then((data) => {
                this.printer.state = data.state.text
                if (data.state == "Disconnected") {
                    this.goto("/asleep")
                }
                if (data.state.text == "Printing") {
                    this.goto("/now-printing")
                }
                this.printer.nozzle.actual = data.temperature.tool0.actual
                this.printer.bed.actual = data.temperature.bed.actual
            })
        },
    },
    data: function () {
        return {
            screenTimeout: null,
            printer: {
                name: "",
                state: "",
                nozzle: {
                    actual: 0,
                },
                bed: {
                    actual: 0,
                },
            },
        }
    },
})
</script>
