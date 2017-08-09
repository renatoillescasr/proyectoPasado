var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var hbsExtend = require('express-handlebars-extend');
var session = require('express-session');

var fileUpload = require('express-fileupload');

var app = express();

mongoose.connect('mongodb://jebenite:180895@ds139665.mlab.com:39665/tareasdaw1');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("mongoose connection successful");
});

// configuracion de Handlebars
var hbs = hbsExtend(exphbs.create({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts'
}));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//autenticacion
app.use(session({
    secret: 'my demo session',
    resave: true, //se crea la sesion pero nunk se cierra
    saveUninitialized: true //
}));
var auth = function(req, res, next) {
    //console.log("este es un middleware");
    if (req.session["rol"] != "paciente") {
        res.sendStatus(401);
        return;
    }
    if (req.session["rol"] != "operario") {
        res.sendStatus(401);
        return;
    }
    next();
};

// default options para subir archivos
app.use(fileUpload());

// Routes
app.use('/', require('./routes/index.js'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('No encontrado');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            layout: false
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        layout: false
    });
});


module.exports = app;
