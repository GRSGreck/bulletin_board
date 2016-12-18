'use strict';

const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common');
const helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: '#cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:8080/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [ new ExtractTextPlugin('[name].css') ],

    devServer: {
        historyApiFallback: true,
        stats: 'normal',
        proxy: [{
            path: '/api',
            target: 'http://localhost:3030'
        }]
    }
});