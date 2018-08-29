"use strict"
var path = require('path');
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';
function resolve(dir) {
    return path.join(__dirname, dir)
}

var config = {}
config.optimization = {
}
config.target = 'web';
//Setting Envirnoment
config.mode = 'development';
config.devtool = 'source-map',
config.entry = {
    entry: './src/index.js',
}
config.output = {
    // path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    // filename: '[name].[hash].js',
    // chunkFilename:'[name].js', 
    // publicPath: "/assets/",
    publicPath: '',
    sourceMapFilename: '[file].map'
}
config.resolve = {
    extensions: [".ts", ".tsx", ".jsx", ".js", ".json", '.scss', '.css']
}
// config.externals={     "react": "React",     "react-dom": "ReactDOM" } module
// setting
config.module = {
    rules: [
        {
            test: /\.(js|jsx|mjs)$/,
            exclude: [resolve('node_modules')],
            // include: [path.resolve(__dirname, 'src')],
            use: {
                loader: 'babel-loader',
                options: {
                    //   presets: ['@babel/preset-env']
                    presets: ['env', 'react'],
                    plugins:["syntax-dynamic-import"]
                }
            }
        }, {
            test: /\.scss$/,
            use: [
                // MiniCssExtractPlugin.loader, 
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: false,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                    }
                }
                , {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [require('autoprefixer')({
                                'browsers': ['> 1%', 'last 2 versions']
                            })]
                    }
                }
                ,{
                loader:'sass-loader',
                options:{
                    // includePaths: [path.resolve(__dirname, 'node_modules/react-datepicker')]
                }
              }
            ]
        }, {
            test: /\.css$/,
            use: [
                // MiniCssExtractPlugin.loader, 
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                    }
                }
                , {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [require('autoprefixer')({
                                'browsers': ['> 1%', 'last 2 versions ']
                            })]
                    }
                }
            ]
        } 
    ]
}
config.plugins = [
    new webpack.HotModuleReplacementPlugin({title: 'Hot Module Replacement'}),
    // new CleanWebpackPlugin(paths [, {options}])
    new CleanWebpackPlugin(['dist']),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
        filename: 'index.html', 
        template: './src/index.html', 
        inject: true, hash: true, chunks: ['entry']
    }),
    // new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery', "window.jQuery": "jquery"}),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output both options are
        // optional
        filename: "[name].css",
        // chunkFilename: "[id].css"
    }),
    new CopyWebpackPlugin([
        { from: 'src/static' }
    ])
]
config.devServer = {
    // inline: true,
    port: 9000,
    hot: true,
    compress: true,
    inline: true,
    watchContentBase: true,
    historyApiFallback: true,
    contentBase: './dist',
    // historyApiFallback: {
    //     index:'day2.html',
    //     rewrites: [
    //         { from: /^\/day2/, to: 'day2.html' }
    //     ]
    // }
}

module.exports = config;