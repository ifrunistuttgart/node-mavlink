var SerialPort = require('serialport');
var mavLinkModule = require('../lib/mavlink-module');
var mavLink = new mavLinkModule.MAVLinkModule();

var serialPort = new SerialPort('COM4', {
    baudRate: 57600
});

serialPort.on('data', function (data) {
    mavLink.parse(data);
});

mavLink.on('error', function (e) {
    //console.log(e);
});

mavLink.on('ACTUATOR_CONTROL_TARGET', function (message) {
    console.log(message);
});
