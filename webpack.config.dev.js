const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports =
    {
        entry:
        [
            'webpack-hot-middleware/client',
            path.resolve(__dirname, 'private/js/main.js'),
        ],
        output:
        {
            path: '/',
            publicPath: '/build/',
            filename: 'bundle.js'
        },
        devtool: 'cheap-eval-source-map',
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new BrowserSyncPlugin({
                host: 'localhost',
                port: '3001',
                proxy: 'http://localhost:3000/',
                files: [{
                    match: [
                        '**/*.pug'
                    ],
                    fn: function(event, file) {
                        if (event === "change") {
                            const bs = require('browser-sync').get('bs-webpack-plugin');
                            bs.reload();
                        }
                    }
                }]

            },{ reload: false })
        ],
        module:
        {
            rules:
            [
                //BABEL
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'private/js'),
                    use:
                    {
                        loader: 'babel-loader',
                        options:
                        {
                            presets: ['env']
                        }
                    }
                },
                //CSS BUILD
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                //SASS BUILD
                {
                    test: /\.(scss|sass)$/,
                    include: path.resolve(__dirname, 'private/sass'),
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
                //IMAGES
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    include: path.resolve(__dirname, 'private/images'),
                    use: 'file-loader'
                },
                //FONTS
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    loader: 'file-loader'
                }
            ]
        }
    };