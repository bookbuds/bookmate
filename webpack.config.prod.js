const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports =
    {
        entry:
        [
            path.resolve(__dirname, 'private/js/main.js'),
        ],
        output:
        {
            path: path.resolve(__dirname, 'public/build/'),
            filename: 'bundle.js'
        },
        devtool: 'cheap-eval-source-map',
        plugins: [

        ],
        plugins: [
            // Extract imported CSS into own file
            new ExtractTextPlugin('style.css'),
            // Minify JS
            new UglifyJsPlugin({
                sourceMap: false,
                compress: true,
            }),
            // Minify CSS
            new webpack.LoaderOptionsPlugin({
                minimize: true,
            }),
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
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader']
                    }),
                },
                //SASS BUILD
                {
                    test: /\.(scss|sass)$/,
                    include: path.resolve(__dirname, 'private/sass'),
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader', 'sass-loader']
                    }),
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