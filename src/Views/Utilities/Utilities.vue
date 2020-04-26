<style lang="sass">
@import "Utilities.scss"
</style>

<template>
    <div @click="resetTimeout()" fill-height fluid class="utilities__container">
        <v-row class="header" align="center" justify="center">
            <v-col class="header-item" align="start">
                {{ $root.printer.name }}
            </v-col>
            <v-col class="header-item" align="center">
                {{ Math.round($root.printer.nozzle.actual) }}°C <v-icon style="margin-right: 12px;" color="#fff" size="20px">mdi-printer-3d-nozzle</v-icon>{{ Math.round($root.printer.bed.actual) }}°C
                <v-icon color="#fff" size="20px">mdi-radiator</v-icon>
            </v-col>
            <v-col class="header-item" align="end">
                {{ $root.printer.state }}
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
import { Helpers } from "@/Mixins/Helpers"

export default Vue.extend({
    name: "Utilities",
    mixins: [OctoPrint, Helpers],
    mounted: function () {

    },
    watch: {
        "$root.printer.state": function(newState) {
            if (newState == "Disconnected") {
                this.goto("/asleep")
            }
            if (newState == "Printing") {
                this.goto("/now-printing")
            }
        }
    },
    data: function () {
        return {
            screenTimeout: null,
        }
    },
})
</script>
