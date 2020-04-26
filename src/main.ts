import Vue from "vue"
import App from "./App.vue"
import AppRouter from "./Router"
import vuetify from "./Plugins/vuetify"
import Notifications from "vue-notification"
import {Config as config} from "@/Mixins/Config"

const axios = require("axios").default

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
            console.log(SocketMessage)
        }
    },
    data: () => {
        return {
            socketConnection: {
                authed: 0,
                token: "",
                sock: {} //SockJS object (JIC)
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
                state: "",
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

