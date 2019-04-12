/*
 * mavlink-module.test.ts
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

import {MAVLinkModule} from "../mavlink-module";
import {messageRegistry} from "../../assets/message-registry";

beforeAll(() => {
});

afterAll(() => {
});

beforeEach(() => {
});

afterEach(() => {
});

test('MAVLink1NoAutoNegotiation', () => {
    const mavlinkModule = new MAVLinkModule(messageRegistry, 1, false);
    expect(mavlinkModule.protocol_version).toBe(1.0);
});

test('MAVLink1WithAutoNegotiation', () => {
    const mavlinkModule = new MAVLinkModule(messageRegistry, 1);
    expect(mavlinkModule.protocol_version).toBe(1.0);
});

test('MAVLink2Upgraded', () => {
    const mavlinkModule = new MAVLinkModule(messageRegistry, 1);
    mavlinkModule.upgradeLink();
    expect(mavlinkModule.protocol_version).toBe(2.0);
});

test('MAVLink1Downgraded', () => {
    const mavlinkModule = new MAVLinkModule(messageRegistry, 1);
    mavlinkModule.upgradeLink();
    mavlinkModule.downgradeLink();
    expect(mavlinkModule.protocol_version).toBe(1.0);
});
