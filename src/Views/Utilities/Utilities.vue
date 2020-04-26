<style lang="sass">
@import "Utilities.scss"
</style>

<template>
    <div @click="resetTimeout()" fill-height fluid class="utilities__container">
        <v-row class="header" align="center" justify="center">
            <v-col class="header-item" align="start">
                {{ printer.name }}
            </v-col>
            <v-col class="header-item" align="center">
                {{ Math.round(printer.nozzle.actual) }}°C <v-icon style="margin-right: 12px;" color="#fff" size="20px">mdi-printer-3d-nozzle</v-icon>{{ Math.round(printer.bed.actual) }}°C
                <v-icon color="#fff" size="20px">mdi-radiator</v-icon>
            </v-col>
            <v-col class="header-item" align="end">
                {{ printer.state }}
            </v-col>
        </v-row>
        <v-row class="utilities__row" align="center" justify="center">
            <v-col @click="goto('/')" v-ripple class="utilities__item">
                <v-icon color="#fff" size="8vw" class="utilities__item-icon">mdi-arrow-left</v-icon><br />
                <span class="utilities__item-title">back</span>
            </v-col>
            <v-col @click="goto('/wizard/leveling')" v-ripple class="utilities__item">
                <v-icon color="#fff" size="8vw" class="utilities__item-icon">mdi-ruler</v-icon><br />
                <span class="utilities__item-title">level bed</span><br />
                <span class="utilities__item-ribbon">beta</span>
            </v-col>
        </v-row>
        <v-row class="utilities__row" align="center" justify="center">
            <v-col @click="goto('/wizard/temptune')" v-ripple class="utilities__item">
                <v-icon color="#fff" size="8vw" class="utilities__item-icon">mdi-tune-vertical</v-icon><br />
                <span class="utilities__item-title">pid tune</span><br />
                <span class="utilities__item-ribbon">beta</span>
            </v-col>
            <v-col @click="goto('/wizard/offset')" v-ripple class="utilities__item">
                <v-icon color="#fff" size="8vw" class="utilities__item-icon">mdi-adjust</v-icon><br />
                <span class="utilities__item-title">z offset</span><br />
                <span class="utilities__item-ribbon">beta</span>
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
    name: "Utilities",
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
                if (data.state.text == "Printing") {
                    //this.goto("/now-printing")
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
