// config-overrides.js
const { override, addWebpackResolve } = require('customize-cra')

module.exports = override(
    addWebpackResolve({
        fallback: {
            buffer: require.resolve('buffer/'),
            url: require.resolve('url/'),
            https: require.resolve('https-browserify'),
            querystring: require.resolve('querystring-es3'),
            assert: require.resolve('assert/'),
            os: require.resolve('os-browserify/browser'),
            stream: require.resolve('stream-browserify'),
            crypto: require.resolve('crypto-browserify'),
            util: require.resolve('util/'),
            path: require.resolve('path-browserify'),
            http: require.resolve("stream-http")
            // Add other fallbacks here
        },
    })
)
