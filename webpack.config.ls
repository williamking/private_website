webpack = require 'webpack'

module.exports =
    watch: true,
    entry:
        'file_transfer': __dirname + 'public/react_views/fileTransfer.js'
    output:
        path: __dirname + 'public/dist_views'
        filename: '[name].bundle.js'
    module:
        loaders: [
            { test: /\css$/, loader: 'style!css' },
            { test: /\.js$/, loader: 'babel-loader!jsx-loader?harmony', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader!jsx-loader?harmony', exclude: /node_modules/ }
        ]
    resolve:
        extensions: ['', '.js', 'jsx']


    
