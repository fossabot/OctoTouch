import Vue from "vue"
import App from "./App.vue"
import AppRouter from "./Router"
import vuetify from "./Plugins/vuetify"
import Notifications from "vue-notification"
import {Config as config} from "@/Mixins/Config"
import {Helpers} from "@/Mixins/Helpers"

const axios = require("axios").default
const moment = require("moment")

Vue.use(vuetify)
Vue.use(Notifications)

Vue.config.productionTip = false
declare global {
    interface Window {
        moment: any
    }
}

const router = AppRouter
new Vue({
    router,
    vuetify,
    mixins: [Helpers],
    mounted: function() {
        this.printer.name = config.printerName

        //Log in to API and get Session key
        axios.post(config.baseURL + "login", { passive: true }, { headers: { "X-Api-Key": config.key } }).then((LoginResponse) => {
            //Log in to socket connection and save sock object in globalState
            const ws = new WebSocket(config.baseURL.replace("api/", "sockjs/websocket").replace("http", "ws"))
            ws.onopen = () => {
                const AuthMessage = {
                    auth: LoginResponse.data.name + ":" + LoginResponse.data.session
                }
                ws.send(JSON.stringify(AuthMessage))
                this.socketConnection.authed = true
            }

            ws.onmessage = (MessageEvent) => {
                const socketMessage = JSON.parse(MessageEvent.data)
                this.parseSocketMessage(socketMessage)
            }
        })
    },
    methods: {
        parseSocketMessage: function(SocketMessage) {
            if(SocketMessage.plugin != undefined) {
                if(SocketMessage.plugin.plugin === "DisplayLayerProgress-websocket-payload") {
                    this.parseDisplayLayerProgressMessage(SocketMessage.plugin)
                }
            } else if(SocketMessage.current != undefined) {
                this.parseCurrentStateMessage(SocketMessage.current)
            }
        },
        parseDisplayLayerProgressMessage: function(SocketMessage) {
            const DisplayLayerProgress = SocketMessage.data
            this.job.currentLayer = parseInt(DisplayLayerProgress.currentLayer)
            this.job.totalLayers = parseInt(DisplayLayerProgress.totalLayer)
            const fanSpeed = DisplayLayerProgress.fanspeed
            if (fanSpeed == "-" || fanSpeed == "Off") {
                this.printer.fan.speed = 0
            } else {
                this.printer.fan.speed = parseInt(fanSpeed.split("%")[0])
            }
        },
        parseCurrentStateMessage: function(SocketMessage) {
            this.printer.state = SocketMessage.state.text
            if(SocketMessage.temps.length > 0) {
                const TempArray = SocketMessage.temps[SocketMessage.temps.length - 1]
                this.printer.nozzle.target = TempArray.tool0.target
                this.printer.nozzle.actual = TempArray.tool0.actual
                this.printer.bed.target = TempArray.bed.target
                this.printer.bed.actual = TempArray.bed.actual

                if (Math.abs(this.printer.nozzle.actual - this.printer.nozzle.target) > 10 || Math.abs(this.printer.bed.actual - this.printer.bed.target) > 3) {
                    this.printer.isHeating = true
                } else {
                    this.printer.isHeating = false
                    this.printer.isCooling = false
                }
            }

            if(SocketMessage.job != undefined) {
                if(SocketMessage.job != {}) {
                    const JobState = SocketMessage.job

                    if (this.printer.isHeating == true || this.printer.isCooling == true) {
                        this.job.percentCompleted = 100
                    } else {
                        this.job.percentCompleted = SocketMessage.progress.completion
                    }

                    this.job.filename = JobState.file.name
                    this.job.filepath = JobState.file.path
                    this.job.timeRemaining = SocketMessage.progress.printTimeLeft
                    const epochComplete = moment().valueOf() + this.job.timeRemaining * 1000
                    this.job.eta = moment(epochComplete).calendar()
                    this.job.filamentUsage[0] = this.lengthToWeight(JobState.filament.tool0.length)
                    if (JobState.filament.tool1 != undefined) {
                        this.job.filamentUsage[1] = this.lengthToWeight(JobState.filament.tool1.length)
                    }
                }
            }
        }
    },
    data: () => {
        return {
            socketConnection: {
                authed: false
            },
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
                state: "Connecting...",
                nozzle: {
                    target: 0,
                    actual: 0,
                    flowrate: 100,
                    feedrate: 100
                },
                bed: {
                    target: 0,
                    actual: 0,
                },
                fan: {
                    speed: 0,
                },
            }
        }
    },
    render: (h) => h(App),
}).$mount("#app")

