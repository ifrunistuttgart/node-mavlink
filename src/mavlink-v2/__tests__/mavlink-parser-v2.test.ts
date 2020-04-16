/*
 * mavlink-parser-v2.test.ts
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

import {MAVLinkModule} from "../../mavlink-module";
import {ParserState} from "../../parser-state.enum";
import {messageRegistry} from "../../../assets/message-registry";
import {MAVLinkMessage} from "../../mavlink-message";
import {MessageInterval} from "../../../assets/messages/message-interval";

let mavlinkModule: MAVLinkModule;

beforeAll(() => {
});

afterAll(() => {
});

beforeEach(() => {
    mavlinkModule = new MAVLinkModule(messageRegistry);
    mavlinkModule.upgradeLink();
});

afterEach(() => {
});

test('MessageStart', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF, 0xFD, 0XFE]));
    // @ts-ignore
    expect(mavlinkModule.parser.state).toBe(ParserState.WaitingForHeaderComplete);
});

test('MessageStartTwoPass', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF]));
    mavlinkModule.parse(Buffer.from([0xFD, 0XFE]));
    // @ts-ignore
    expect(mavlinkModule.parser.state).toBe(ParserState.WaitingForHeaderComplete);
});

test('NoMessageStart', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF, 0XFE]));
    // @ts-ignore
    expect(mavlinkModule.parser.state).toBe(ParserState.WaitingForMagicByte);
});

test('MessageStartNotFound', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF]));
    // @ts-ignore
    expect(mavlinkModule.parser.state).toBe(ParserState.WaitingForMagicByte);
});

test('MessageStartNotFoundEmptyBuffer', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF]));
    // @ts-ignore
    expect(mavlinkModule.parser.buffer.length).toBe(0);
});

test('MessageTruncated', () => {
    const testMessage = new MessageInterval(255, 0);
    testMessage.interval_us = 1;
    const message_id = 2;
    testMessage.message_id = message_id;
    const testMessages: MAVLinkMessage[] = Array<MAVLinkMessage>();
    testMessages.push(testMessage);

    const buffer = mavlinkModule.pack(testMessages);
    return mavlinkModule.parse(buffer).then(message => {
        expect.assertions(1);
        // @ts-ignore
        expect(message[0].message_id).toBe(message_id);
    });
});

test('MessageTruncatedPartiallyLeadingZero', () => {
    const buffer = Buffer.from([0xfd, 0xa, 0x0, 0x0, 0x0, 0xff, 0x0, 0x2, 0x0, 0x0, 0x0, 0xf, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0xf, 0x14, 0x11])

    return mavlinkModule.parse(buffer).then(message => {
        expect.assertions(1);
        // @ts-ignore
        expect(message[0].time_boot_ms).toBe(0x0F00);
    });
});

test('MessageTruncatedNonTrailingZero', () => {
    const buffer = Buffer.from([0xfd, 0x5, 0x0, 0x0, 0x0, 0xff, 0x0, 0x2, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x3, 0x27, 0xdb])

    expect.assertions(1);
    return expect(mavlinkModule.parse(buffer)).resolves.toBeDefined();
});
