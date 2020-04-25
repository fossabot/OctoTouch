const path = require("path")

module.exports = {
    transpileDependencies: ["vuetify"],
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: "octotouch",
                linux: {
                    target: [
                        {
                            target: "deb",
                            arch: ["armv7l"],
                        },
                    ],
                    category: "Utility",
                },
                extends: null,
            },
        },
    },
    chainWebpack: config => {
        config.resolve.alias.set("Components", path.resolve(__dirname, "src/Components")).set("Mixins", path.resolve(__dirname, "src/Mixins"))
    },
}
