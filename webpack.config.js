'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require('./config/helpers');

module.exports = {
    context: helpers.root('src'),

    entry: {
        polyfills: './polyfills.ts',
        vendor: './vendor.ts',
        app: './main.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw-loader'
            }
        ]
    },


    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'vendor', 'polyfills']
        }),

        new ExtractTextPlugin('[name].css'),

        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ],

    devtool: '#cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:8080/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    devServer: {
        historyApiFallback: true,
        stats: 'normal',
        proxy: [{
            path: '/api',
            target: 'http://localhost:3030'/*,
            secure: true*/
        }]
    }
};