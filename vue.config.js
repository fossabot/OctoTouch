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
                        {
                            "target": "deb",
                            "arch": [
                                "armv7l"
                            ]
                        }
                    ],
                    "category": "Utility"
                },
                "extends": null
            }
        }
    }
}