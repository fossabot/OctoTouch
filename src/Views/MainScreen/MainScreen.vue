<style lang="sass">
@import "MainScreen.scss"
</style>

<template>
    <div @click="resetTimeout()" fill-height fluid class="container">
        <v-row class="header" align="center" justify="center">
            <v-col class="header-item" align="start">
                {{ $root.printer.name }}
            </v-col>
            <v-col class="header-item" align="center">
                {{ Math.round($root.printer.nozzle.actual) }}°C <v-icon style="margin-right: 12px; margin-top: -4px;" color="#fff" size="20px">mdi-printer-3d-nozzle</v-icon
                >{{ Math.round($root.printer.bed.actual) }}°C <v-icon color="#fff" style="margin-top: -4px;" size="20px">mdi-radiator</v-icon>
            </v-col>
            <v-col class="header-item" align="end">
                {{ $root.printer.state }}
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
// eslint-disable-next-line no-undef
import { Helpers } from "@/Mixins/Helpers"

export default Vue.extend({
    name: "MainScreen",
    mixins: [OctoPrint, Helpers],
    mounted: function () {
        this.update()
        this.updateInterval = setInterval(this.update, 2500)
    },
    methods: {
        resetTimeout: function () {
            return 1
        },
        update: function () {
            if (this.$root.printer.state == "Disconnected") {
                this.goto("/asleep")
            }
            if (this.$root.printer.state == "Printing") {
                this.goto("/now-printing")
            }
        },
    },
    data: function () {
        return {
            screenTimeout: null
        }
    },
})
</script>
