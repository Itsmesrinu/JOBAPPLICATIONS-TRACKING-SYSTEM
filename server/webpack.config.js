const webpack = require('webpack');

module.exports = {
    resolve: {
        fallback: {
            "stream": false,
            "crypto": false,
            "buffer": false,
            "util": false,
            "path": false
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser'
        })
    ]
};
