/*
 * mavlink-packer-v2.test.ts
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

import {CommandLong} from "../../../assets/messages/command-long";
import {MavCmd} from "../../../assets/enums/mav-cmd";
import {MAVLinkModule} from "../../mavlink-module";
import {messageRegistry} from "../../../assets/message-registry";

let mavlinkModule: MAVLinkModule;

beforeAll(() => {
});

afterAll(() => {
});

beforeEach(() => {
    mavlinkModule = new MAVLinkModule(messageRegistry, 1, false);
    mavlinkModule.upgradeLink();
});

afterEach(() => {
});

test('MessagePackUnpack', async () => {
    const cmd = new CommandLong(1, 0);
    cmd.command = MavCmd.MAV_CMD_REQUEST_PROTOCOL_VERSION;
    const messages = await mavlinkModule.parse(mavlinkModule.pack([cmd]));
    // @ts-ignore
    expect(messages[0].command).toBe(MavCmd.MAV_CMD_REQUEST_PROTOCOL_VERSION);
});
