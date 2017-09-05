require('dotenv').config()
const express = require( 'express' );
const expressSession = require( 'express-session' );
const passport = require( './config/passport.config' );
const flash = require( 'connect-flash' );
const path = require( 'path' );
const favicon = require( 'serve-favicon' );
const logger = require( 'morgan' );
const cookieParser = require( 'cookie-parser' );
const bodyParser = require( 'body-parser' );
const errorHandler = require( './middleware/error-handler' );


//SERVER
const app = express();

//=========================
// VIEW ENGINE
//=========================
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'pug' );

//=========================
// STATIC FILES OR WEBPACK
//=========================
if ( process.env.NODE_ENV === 'development' ) {
    const webpack = require( 'webpack' );
    const webpackDevMiddleware = require( 'webpack-dev-middleware' );
    const webpackHotMiddleware = require( 'webpack-hot-middleware' );
    const config = require('./webpack.config.js' );
    const compiler = webpack( config );
    app.use( webpackDevMiddleware( compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,
        },
    }))
    app.use( webpackHotMiddleware( compiler, {
        log: console.log,
    }));
} else if ( process.env.NODE_ENV === 'production' ) {
    app.use( express.static( path.join( __dirname, 'public' ) ) );    
}

//=========================
// MIDDLEWARE
//=========================
app.use( favicon( path.join( __dirname, 'public', 'favicon.ico' ) ) );
app.use( logger( 'dev' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( flash() );
app.use( expressSession( { secret: "My Secret Book" } ) );
app.use( passport.initialize() );
app.use( passport.session() );

//=========================
// CONTROLLER
//=========================
app.use( require( './controllers' ) );


//=========================
// 404 ERROR HANDLER
//=========================
app.use( errorHandler.errorCatcher );
app.use( errorHandler.errorDisplay );

module.exports = app;
