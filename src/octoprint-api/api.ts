import {config} from "../config.ts"
const axios = require("axios").default

const OctoprintAPI = {
    methods: {
        //Getters
        getJobStatus: function() {
            return new Promise(function(resolve, reject) {
                axios.get(config.baseURL + "job", {headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            });
        },
        getPrinterStatus: function() {
            return new Promise(function(resolve, reject) {
                axios.get(config.baseURL + "printer", {headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            });
        },
        getLayerStatus: function() {
            return new Promise(function(resolve, reject) {
                axios.get((config.baseURL + "plugin/DisplayLayerProgress/values").replace("/api", ""), {headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            });
        },
        getFiles: function() {
            return new Promise(function(resolve, reject) {
                axios.get((config.baseURL + "files"), {headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data.files)
                }).catch(function(error) {
                    reject(error)
                })
            });
        },

        //Setters
        pausePrint: function() {
            return new Promise(function(resolve, reject) {
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
        resumePrint: function() {
            return new Promise(function(resolve, reject) {
                axios.post(config.baseURL + "job", {command: "pause", action: "resume"} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            })
        },
        cancelPrint: function() {
            return new Promise(function(resolve, reject) {
                axios.post(config.baseURL + "job", {command: "cancel"} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            })
        },
        togglePause: function() {
            return new Promise(function(resolve, reject) {
                axios.post(config.baseURL + "job", {command: "pause", action: "toggle"} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            })
        },
        setFeedrate: function(feedrate) {
            return new Promise(function(resolve, reject) {
                if(feedrate == 100) {
                    resolve()
                }
                axios.post(config.baseURL + "printer/printhead", {command: "feedrate", factor: feedrate}, {headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            })
        },
        setFlowrate: function(flowrate) {
            return new Promise(function(resolve, reject) {
                if(flowrate == 100) {
                    resolve()
                }
                axios.post(config.baseURL + "printer/tool", {command: "flowrate", factor: flowrate}, {headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            })
        },
        setNozzleTemp: function(temperature) {
            return new Promise(function(resolve, reject) {
                axios.post(config.baseURL + "printer/tool", {command: "target", targets: { tool0: temperature, tool1: temperature }} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            })
        },
        setBedTemp: function(temperature) {
            return new Promise(function(resolve, reject) {
                axios.post(config.baseURL + "printer/bed", {command: "target", target: temperature} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            })
        },
        action: function(action) {
            if(action == "home") {
                return new Promise(function(resolve, reject) {
                    axios.post(config.baseURL + "printer/printhead", {command: "home", axes: ["x","y","z"]} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                        resolve(response.data)
                    }).catch(function(error) {
                        reject(error)
                    })
                })
            }
        },
        jog: function(axis, amt) {
            return new Promise(function(resolve, reject) {
                axios.post(config.baseURL + "printer/printhead", {command: "jog", [axis]: amt, speed: 4200} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
            })
        },

        //Helper functions
        lengthToWeight: function(length) {
            return (
                Math.round(
                    (Math.PI *
                        (config.filamentThickness / 2) *
                        length *
                        config.filamentDensity) /
                        100,
                ) / 10
            );
        },
        goto: function(url) {
            console.log(this.screenTimeout)
            if(this.screenTimeout != undefined) {
                clearTimeout(this.screenTimeout)
            }
            if(this.updateInterval != undefined) {
                clearInterval(this.updateInterval)
            }
            this.$router.push(url)
        }
    },
    data: function() {
        return {
            updateInterval: 0
        }
    }
}
export {OctoprintAPI}