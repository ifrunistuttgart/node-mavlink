import {MAVLinkModule, MAVLinkMessage} from 'node-mavlink';
import {messageRegistry} from './assets/message-registry';

import Serialport from 'serialport';

const mavLink = new MAVLinkModule(messageRegistry);
const serialPort = new Serialport('COM4', {
    baudRate: 57600
});

serialPort.on('data', function (data: Buffer) {
    mavLink.parse(data);
});

mavLink.on('error', function (e: Error) {
    // event listener for node-mavlink ALL error message
    //console.log(e);
});

mavLink.on('message', function (message: MAVLinkMessage) {
    // event listener for all messages
    console.log(message);
});

mavLink.on('COMMAND_LONG', function (bytes: Buffer) {
    console.log('Sending COMMAND_LONG to PX4');
    serialPort.write(bytes);
});

mavLink.on('HIGHRES_IMU', function (message: MAVLinkMessage) {
    // event listener for HIGHRES_IMU message
    console.log(message);
});
