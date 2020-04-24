module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "octotouch",
        "linux": {
          "target": [
            "AppImage",
            "deb"
          ]
        },
        "extends": null
      }
    }
  }
}