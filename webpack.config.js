"use strict";

const path = require('path');
const webpack = require('webpack');
const BowerWebpackPlugin = require('bower-webpack-plugin');

const plugins = [
  new BowerWebpackPlugin({
    modulesDirectories: ["bower_components"],
    manifestFiles: "bower.json",
    includes: /.*/,
    excludes: [],
    searchResolveModulesDirectories: true
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    chunks: ['layout', 'index', 'articles', 'article_content', 'create_article', 'lab', 'wallpaper']
  })
];

if (process.env.NODE_ENV == 'production') {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  );
}

module.exports = {
  watch: false,
  entry: {
    'layout': __dirname + '/src/public/react_views/layout_v.jsx',
    'index': __dirname + '/src/public/react_views/index_v.jsx',
    'articles': __dirname + '/src/public/react_views/articles_v.jsx',
    'article_content': __dirname + '/src/public/react_views/article_content_v.jsx',
    'create_article': __dirname + '/src/public/react_views/create_article_v.jsx',
    'lab': __dirname + '/src/public/react_views/lab_v.jsx',
    'wallpaper': __dirname + '/src/public/react_views/wallpaper_v.jsx'
  },
  output: {
    path: __dirname + '/public/dist',
    filename: '[name].bundle.js',
    publicPath: '../dist/'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=stage-2',
        exclude: [/node_modules/, /bower_components/]
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-0,presets[]=stage-2,plugins[]=transform-react-jsx-source',
        exclude: [/node_modules/, /bower_components/]
      },
      {
        test: /\.sass$/,
        loader: 'style!css!sass-loader'
      },
      // { test: /\.ttf$/, loader: 'url-loader', exclude: /node_modules/ },
      {
        test: /\.jpg$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader"
      }
    ],
  },
  resolve: {
    modulesDirectories: ['web_modules', 'node_modules', 'bower_components'],
    extensions: ['', '.js', 'jsx', 'css']
  },
  plugins
}
