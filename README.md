[![Build Status](https://travis-ci.org/ifrunistuttgart/node-mavlink.svg?branch=master)](https://travis-ci.org/ifrunistuttgart/node-mavlink)
[![Coverage Status](https://coveralls.io/repos/github/ifrunistuttgart/node-mavlink/badge.svg?branch=master)](https://coveralls.io/github/ifrunistuttgart/node-mavlink?branch=master)
# node-mavlink
node-mavlink is a library for parsing and packing MAVLink 2 messages using TypeScript or, when transpiled, using JavaScript in NodeJS. This project is an typed alternative for [node-mavlink](https://github.com/omcaree/node-mavlink) with the additional support of MAVLink2.
### Limitations
At this point, not supported are:
* message signing
* arrays

## Installation
The module is published on npm. Install using:

    npm install @ifrunistuttgart/node-mavlink --save

## Usage
To be able to use this module, the MAVLink message definitions need to be parsed using the official [pymavlink](https://github.com/ArduPilot/pymavlink), which creates the TypeScript classes.
Using the command-line interface, the classes can be generated using

    python tools/mavgen.py -o ./assets --lang TypeScript --wire-protocol 2.0 <message_definition.xml>
which will produce all needed TypeScript files in a folder called *assets*. Instead of *<message_definition.xml>* you will probably use *common.xml*.
Together with the all messages (*classes* directory) and enums (*enums* directory), a file *messageRegistry.ts* is created, which provides an array holding all message IDs and the respective constructor.

If you want to use the library with pure JavaScript, you need to transpile the generated files. You can install the transpiler with:

    npm i typescript --save-dev
Then run within the *assets* directory

    tsc
 to start the process.

## Examples
### TypeScript

```ts
import {MAVLinkModule, MAVLinkMessage} from '@ifrunistuttgart/node-mavlink';  
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
```

### JavaScript
```js
var SerialPort = require('serialport');  
var messageRegistry = require('.assets/messageRegistry');  
var mavLink = require('@ifrunistuttgart/node-mavlink')(messageRegistry);  
  
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
```
# License
node-mavlink is released under the GNU Lesser General Public License v3 or later.
<!--stackedit_data:
eyJoaXN0b3J5IjpbNzM0MTg2MjMwLC0yMDA0NjMyNzEzLDEzMz
EwODI4MjMsLTE2MjY5MzM0OTVdfQ==
-->
