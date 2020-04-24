module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "octotouch",
        "name": "OctoTouch",
        "description": "OctoPrint touch panel with material design influences",
        "linux": {
          "target": [
            "AppImage",
            "deb"
          ]
        }
      }
    }
  }
}