const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlagin = require('copy-webpack-plugin')

const baseConfig = {
    entry: path.resolve(__dirname, './client/src/index'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: 'ts-loader'
            },

            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|svg)$/,
                type: 'asset'
            },
        ],
    },
    resolve: {
        extensions: ['.ts','.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist'),
    },
    plugins: [
        new EslintPlugin({
             extensions: 'ts',
            }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './client/src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        // new CopyWebpackPlagin(
        //     {
        //         patterns: [
        //             {
        //                 from: './client/src/assets',
        //                 to: 'assets',
        //             },
        //         ]
        //     }
        //     )
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};
