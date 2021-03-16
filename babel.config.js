module.exports = {
    "presets": [
        ["@babel/preset-env", {
            targets: {
                esmodules: true,
            },
        }],
        "@babel/preset-react"
    ],
    highlightCode: false,
    sourceMaps: "both",
    plugins: [
        ['@babel/plugin-proposal-class-properties']
    ]
}
