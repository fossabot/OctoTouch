import { Config as config } from "@/Mixins/Config"
const axios = require("axios").default

const OctoPrint = {
    methods: {
        //Getters
        getJobStatus: function () {
            return new Promise(function (resolve, reject) {
                axios
                    .get(config.baseURL + "job", { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        getPrinterStatus: function () {
            return new Promise(function (resolve, reject) {
                axios
                    .get(config.baseURL + "printer", { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        getLayerStatus: function () {
            return new Promise(function (resolve, reject) {
                axios
                    .get((config.baseURL + "plugin/DisplayLayerProgress/values").replace("/api", ""), { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        getFiles: function () {
            return new Promise(function (resolve, reject) {
                axios
                    .get(config.baseURL + "files", { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: { files: unknown } }) {
                        resolve(response.data.files)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },

        //Setters
        pausePrint: function () {
            return new Promise(function (resolve, reject) {
                /*
                axios.post(config.baseURL + "job", {command: "pause"} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
                */
                alert("pause")
                resolve()
                reject()
            })
        },
        resumePrint: function () {
            return new Promise(function (resolve, reject) {
                axios
                    .post(config.baseURL + "job", { command: "pause", action: "resume" }, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        cancelPrint: function () {
            return new Promise(function (resolve, reject) {
                axios
                    .post(config.baseURL + "job", { command: "cancel" }, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        togglePause: function () {
            return new Promise(function (resolve, reject) {
                axios
                    .post(config.baseURL + "job", { command: "pause", action: "toggle" }, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        setFeedrate: function (feedrate: number) {
            return new Promise(function (resolve, reject) {
                if (feedrate == 100) {
                    resolve()
                }
                axios
                    .post(config.baseURL + "printer/printhead", { command: "feedrate", factor: feedrate }, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        setFlowrate: function (flowrate: number) {
            return new Promise(function (resolve, reject) {
                if (flowrate == 100) {
                    resolve()
                }
                axios
                    .post(config.baseURL + "printer/tool", { command: "flowrate", factor: flowrate }, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        setNozzleTemp: function (temperature: any) {
            return new Promise(function (resolve, reject) {
                axios
                    .post(config.baseURL + "printer/tool", { command: "target", targets: { tool0: temperature, tool1: temperature } }, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        setBedTemp: function (temperature: any) {
            return new Promise(function (resolve, reject) {
                axios
                    .post(config.baseURL + "printer/bed", { command: "target", target: temperature }, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        action: function (action: string) {
            if (action == "home") {
                return new Promise(function (resolve, reject) {
                    axios
                        .post(config.baseURL + "printer/printhead", { command: "home", axes: ["x", "y", "z"] }, { headers: { "X-Api-Key": config.key } })
                        .then(function (response: { data: unknown }) {
                            resolve(response.data)
                        })
                        .catch(function (error: any) {
                            reject(error)
                        })
                })
            }
        },
        jog: function (axis: any, amt: any) {
            return new Promise(function (resolve, reject) {
                axios
                    .post(config.baseURL + "printer/printhead", { command: "jog", [axis]: amt, speed: 4200 }, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        printFile: function (file: { path: string }) {
            return new Promise(function (resolve, reject) {
                axios
                    .post(config.baseURL + "files/local/" + file.path, { command: "select", print: "true" }, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },
        deleteFile: function (file: { path: string }) {
            return new Promise(function (resolve, reject) {
                axios
                    .delete(config.baseURL + "files/local/" + file.path, { headers: { "X-Api-Key": config.key } })
                    .then(function (response: { data: unknown }) {
                        resolve(response.data)
                    })
                    .catch(function (error: any) {
                        reject(error)
                    })
            })
        },

        //Helper functions
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
    },
    data: function () {
        return {
            updateInterval: 0,
        }
    },
}
export { OctoPrint }
