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
        "homepage": "https://github.com/acvigue/OctoTouch",
        "repository": "https://github.com/acvigue/OctoTouch",
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