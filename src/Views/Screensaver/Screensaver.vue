<style lang="sass">
@import "Screensaver.scss"
</style>

<template>
    <div fill-height fluid class="container">

    </div>
</template>

<script lang="ts">
import Vue from "vue"
import { OctoPrint } from "@/Mixins/OctoPrint"
import { Helpers } from "@/Mixins/Helpers"

export default Vue.extend({
    name: "Screensaver",
    mixins: [OctoPrint, Helpers],
    mounted: function () {
        this.update()
        this.updateInterval = setInterval(this.update, 2500)
    },
    methods: {
        update: function () {
            this.getPrinterStatus()
                .then((data) => {
                    if(data.state.text != "Operational") {
                        this.goto("/")
                    }
                })
        },
    },
    data: function () {
        return {
        }
    }
})
</script>
