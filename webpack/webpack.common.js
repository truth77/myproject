require('dotenv').config();
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    target: 'web',
    entry: ['@babel/polyfill', path.resolve(__dirname, '../client/src/index.js')],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules\/(?!(@babel\/runtime|@babel\/plugin-transform-runtime|@babel\/preset-env|@babel\/preset-react|react|react-dom|react-refresh)\/).*/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    targets: '> 0.25%, not dead',
                                    useBuiltIns: 'usage',
                                    corejs: 3
                                }],
                                ['@babel/preset-react', { 
                                    runtime: 'automatic',
                                    development: isDevelopment 
                                }]
                            ],
                            plugins: [
                                isDevelopment && 'react-refresh/babel',
                                ['@babel/plugin-transform-runtime', {
                                    regenerator: true,
                                    corejs: 3
                                }],
                                ['@babel/plugin-proposal-class-properties', { loose: true }],
                                ['@babel/plugin-proposal-private-methods', { loose: true }],
                                ['@babel/plugin-proposal-private-property-in-object', { loose: true }]
                            ].filter(Boolean)
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|ttf|eot|otf|jpg|jpe?g|png|gif|svg|ico)(\?.*$|$)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/'
                        }
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: isDevelopment 
                                    ? '[path][name]__[local]--[hash:base64:5]' 
                                    : '[hash:base64]',
                                auto: true,
                                exportLocalsConvention: 'camelCase',
                            },
                            sourceMap: isDevelopment,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment,
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, '../node_modules')]
                            }
                        }
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: [
                                path.resolve(__dirname, '../client/sass/_utils.scss')
                            ]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        isDevelopment && new webpack.HotModuleReplacementPlugin(),
        isDevelopment && new ReactRefreshWebpackPlugin({
            overlay: {
                sockIntegration: 'wds',
            },
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.FACEBOOK_APP_ID': JSON.stringify(process.env.FACEBOOK_APP_ID || '')
        }),
        !isDevelopment && new MiniCssExtractPlugin({
            filename: 'styles.[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
        }),
    ].filter(Boolean),
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    node: {
        fs: 'empty',
        tls: 'empty',
        net: 'empty',
        console: false,
        global: true,
        process: true,
        Buffer: true,
        __filename: 'mock',
        __dirname: 'mock',
        setImmediate: true,
    },
};
