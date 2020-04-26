const moment = require("moment")
import {Config as config} from "@/Mixins/Config"
const Helpers = {
    methods: {
        lengthToWeight: function (length: number) {
            return Math.round((Math.PI * (config.filamentThickness / 2) * length * config.filamentDensity) / 100) / 10
        },
        goto: function (url: any) {
            if (this.updateInterval != undefined) {
                clearInterval(this.updateInterval)
            }
            this.$router.push(url)
        },
        formatFileName: function (name: string) {
            if (config.cura == true) {
                //Cura places a machine identifier at the start of the file name appended by an underscore.
                return name.split("_").splice(1).join("_").replace(".ufp", "").replace(".gcode", "").replace(/_/g, " ")
            } else {
                return name.replace(".ufp", "").replace(".gcode", "").replace(/_/g, " ")
            }
        },
        formatTimeRemaining: function (remainingSeconds) {
            return moment("2015-01-01").startOf("day").seconds(remainingSeconds).format("H:mm")
        }
    }
}
export { Helpers }