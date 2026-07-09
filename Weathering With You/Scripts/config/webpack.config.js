const path = require('path');
const webpack = require('webpack');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = (env, argv) => {
    const isProduction = (argv && argv.mode) === 'production' || process.env.NODE_ENV === 'production';

    return {
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        entry: path.resolve(__dirname, '../src/index.js'),
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: 'index.js',
            publicPath: '/Scripts/dist/',
        },
        resolve: {
            extensions: ['.js', '.jsx'],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                        },
                    },
                },
                {
                    test: /\.s?css$/,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext]',
                    },
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
                'process.env.REACT_APP_OPENWEATHER_KEY': JSON.stringify(process.env.REACT_APP_OPENWEATHER_KEY),
                'process.env.REACT_APP_UNSPLASH_KEY': JSON.stringify(process.env.REACT_APP_UNSPLASH_KEY),
            }),
        ],
    };
};
