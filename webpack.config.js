"use strict";

module.exports = {
    watch: false,
    entry: {
        'layout': __dirname + '/src/public/react_views/layout_v.jsx',
        'index': __dirname + '/src/public/react_views/index_v.jsx',
        'articles': __dirname + '/src/public/react_views/articles_v.jsx',
        'article_content': __dirname + '/src/public/react_views/article_content_v.jsx',
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
            { test: /\.ttf$/, loader: 'url-loader', exclude: /node_modules/ },
            { test: /\.jpg$/, loader: 'url-loader?limit=8192' },
        ],
    },
    resolve: {
        extensions: ['', '.js', 'jsx'],
    },
}
