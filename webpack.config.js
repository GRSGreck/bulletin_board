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
                include: helpers.root('src'),
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports-loader?jQuery=jquery' },
            {
                test: /\.html$/,
                include: helpers.root('src'),
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                include: helpers.root('src'),
                loader: 'file-loader?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.(woff2?|ttf|eot|svg)$/,
                exclude: helpers.root('src'),
                loader: 'url?limit=10000'
            },
            {
                test: /\.scss$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract(
                    'style-loader',
                    [
                        'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]__[hash:base64:5]',
                        'postcss-loader',
                        'sass-loader?sourceMap',
                        'sass-resources-loader'
                    ].join('!')
                )
            },
            {
                test: /\.scss$/,
                include: helpers.root('src', 'app'),
                loaders: [
                    'to-string-loader',
                    'css-loader?sourceMap',
                    'postcss-loader',
                    'sass-loader?sourceMap'
                ]
            }
        ],
    },

    sassResources: helpers.root('config', 'sass-resources.scss'),

    postcss: function () {
        return [
            require('postcss-pxtorem'),
            require('autoprefixer')({
                browsers: [
                    '> 5%',
                    'last 20 versions',
                    'ie > 7'
                ]
            })/*,
            require('precss')*/
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'vendor', 'polyfills']
        }),

        new ExtractTextPlugin('styles.css'),

        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),

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