var SerialPort = require('serialport');
var messageRegistry = require('.assets/messageRegistry');
var mavLink = require('node-modules')(messageRegistry);

var serialPort = new SerialPort('COM4', {
    baudRate: 57600
});

serialPort.on('data', function (data) {
    mavLink.parse(data);
});

mavLink.on('error', function (e) {
    //console.log(e);
});

mavLink.on('message', function (message) {
    // event listener for all messages
    console.log(message);
});

mavLink.on('COMMAND_LONG', function (bytes) {
    console.log('Sending COMMAND_LONG to PX4');
    serialPort.write(bytes);
});

mavLink.on('HIGHRES_IMU', function (message) {
    // event listener for HIGHRES_IMU message
    console.log(message);
});
