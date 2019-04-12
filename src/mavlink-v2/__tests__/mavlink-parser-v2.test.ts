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
