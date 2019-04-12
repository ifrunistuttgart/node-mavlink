/*
 * index.ts
 *
 * Copyright (c) 2019,
 * Institute of Flight Mechanics and Control, University of Stuttgart.
 * Pascal Groß <pascal.gross@ifr.uni-stuttgart.de>
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

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
