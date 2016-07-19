"use strict";

module.exports = {
    watch: true,
    entry: {
    },
    output: {
        path: __dirname + 'public/dist_views',
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.js$/, loader: 'babel-loader!jsx-loader?harmony', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader!jsx-loader?harmony', exclude: /node_modules/ },
        ],
    },
    resolve: {
        extensions: ['', '.js', 'jsx'],
    },
}
