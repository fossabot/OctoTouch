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
                /*
                axios.post(config.baseURL + "job", {command: "pause", action: "resume"} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
                */
                alert("resume")
                resolve()
                reject()
            })
        },
        cancelPrint: function() {
            return new Promise(function(resolve, reject) {
                /*
                axios.post(config.baseURL + "job", {command: "cancel"} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
                */
                alert("cancel")
                resolve()
                reject()
            })
        },
        showCancellationDialog: function() {
            return new Promise((resolve, reject) => {
                this.$swal('Wait!','lorem ipsum','warning')
                resolve()
                reject()
            })
        },
        togglePause: function() {
            return new Promise(function(resolve, reject) {
                /*
                axios.post(config.baseURL + "job", {command: "pause", action: "toggle"} ,{headers: {"X-Api-Key": config.key}}).then(function(response) {
                    resolve(response.data)
                }).catch(function(error) {
                    reject(error)
                })
                */
                alert("toggle")
                resolve()
                reject()
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
            this.$router.push(url)
        }
    }
}
export {OctoprintAPI}