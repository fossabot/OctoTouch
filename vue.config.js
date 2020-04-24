module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "octotouch",
    "dmg": {
      "contents": [
        {
          "x": 110,
          "y": 150
        },
        {
          "x": 240,
          "y": 150,
          "type": "link",
          "path": "/Applications"
        }
      ]
    },
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