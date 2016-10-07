var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');
var serialPort = require('bluetooth-serial-port');
var BTserial = new serialPort.BluetoothSerialPort(),
    sysAddress = '98-4f-ee-04-87-aa';
var delayed = require('delayed');
//var sleep = require('sleep');


var buffertools = require('buffertools').extend();

var app = express();


var io = socket_io();
app.io = io;

var global = 'none';

app.use(express.static(__dirname));


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}


BTserial.on('found', function (address, name) {
    console.log('found something', 'address :' + address + 'name :' + name);

    BTserial.findSerialPortChannel(address, function (channel) {
        if (address != sysAddress) {

            console.log('Address found not Matches to sysAddress');
            return;
        }

        BTserial.connect(address, 3, function () {
            console.log('Bluetooth Connected at address:' + address);

            if (address === sysAddress) {

                io.sockets.on('connection', function (socket) {
                    console.log('Socket Connected');

                    socket.on('message0', function (data) {

                        var buf0 = new Buffer(data, 'utf-8');

                        console.log(buf0.toString('utf-8'));

                        BTserial.write(buf0, function (err, bytesWritten) {
                            if (err) {
                                console.log(err);
                            }
                            if (bytesWritten == buf0.length) {
                                //console.log('All bytes are written');
                            }
                            sleep(50);
                            buf0.clear();


                        });
                    });


                    socket.on('message2', function (data) {

                        var buf2 = new Buffer(data, 'utf-8');

                        console.log(buf2.toString('utf-8'));

                        BTserial.write(buf2, function (err, bytesWritten) {
                            if (err) {
                                console.log(err);
                            }
                            if (bytesWritten == buf2.length) {
                                console.log('All bytes are written');
                            }
                            sleep(50);
                            buf2.clear();


                        });

                    });

                    socket.on('message3', function (data) {

                        var buf3 = new Buffer(data, 'utf-8');

                        console.log(buf3.toString('utf-8'));

                        BTserial.write(buf3, function (err, bytesWritten) {
                            if (err) {
                                console.log(err);
                            }
                            if (bytesWritten == buf3.length) {
                                console.log('All bytes are written');
                            }
                            sleep(50);
                            buf3.clear();


                        });

                    });

                    socket.on('message4', function (data) {

                        var buf4 = new Buffer(data, 'utf-8');

                        console.log(buf4.toString('utf-8'));


                        BTserial.write(buf4, function (err, bytesWritten) {
                            if (err) {
                                console.log(err);
                            }
                            if (bytesWritten == buf4.length) {
                                console.log('All bytes are written');
                            }
                            sleep(50);
                            buf4.clear();


                        });

                    });


                });


                // }, function () {
                console.log('cannot connect');
            }
        });
    });
});


BTserial.inquire();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
