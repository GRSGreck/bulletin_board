'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require('./helpers');

module.exports = {
    context: helpers.root('src'),

    entry: {
        polyfills: './polyfills.ts',
        vendor: './vendor.ts',
        app: './main.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js', '.scss']
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
                loader: 'url-loader?name=assets/[name].[hash].[ext]&limit=5000'
            },
            {
                test: /\.(woff2?|ttf|eot|svg)$/,
                exclude: helpers.root('src'),
                loader: 'url-loader?name=assets/[name].[hash].[ext]&limit=10000'
            },
            {
                test: /\.scss$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract(
                    'style-loader',
                    ['css-loader', 'postcss-loader', 'sass-loader?sourceMap'].join('!')
                )
            },
            {
                test: /\.scss$/,
                include: helpers.root('src', 'app'),
                loaders: ['to-string-loader', 'css-loader', 'postcss-loader', 'sass-loader?sourceMap']
            }
        ],
    },

    postcss: function () {
        return [
            require('postcss-pxtorem'),
            require('postcss-focus'),
            require('autoprefixer')({
                browsers: ['> 5%', 'last 20 versions', 'ie > 7']
            })
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'vendor', 'polyfills']
        }),

        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),

        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
};