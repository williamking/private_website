"use strict";

module.exports = {
    watch: false,
    entry: {
        'layout': __dirname + '/public/react_views/layout_v.jsx'
    },
    output: {
        path: __dirname + 'public/dist',
        filename: '[name].bundle.js',
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.js$/, loader: 'babel-loader!jsx-loader?harmony', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader!jsx-loader?harmony', exclude: /node_modules/ },
            { test: /\.sass$/, loader: 'style!css!sass-loader' },
        ],
    },
    resolve: {
        extensions: ['', '.js', 'jsx'],
    },
}
