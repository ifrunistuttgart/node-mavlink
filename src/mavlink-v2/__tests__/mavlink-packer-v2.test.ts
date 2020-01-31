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
import {MissionCount} from "../../../assets/messages/mission-count";
import {MavCmd} from "../../../assets/enums/mav-cmd";
import {MAVLinkModule} from "../../mavlink-module";
import {messageRegistry} from "../../../assets/message-registry";
import { MavMissionType } from "../../../assets/enums/mav-mission-type";

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

test('MessageExtensionPackUnpack', async () => {
    const msg = new MissionCount(1, 0);
    msg.count = 16;
    msg.mission_type = MavMissionType.MAV_MISSION_TYPE_FENCE;
    const messages = await mavlinkModule.parse(mavlinkModule.pack([msg]));
    // @ts-ignore
    expect(messages[0]._message_id).toBe(msg._message_id);
    expect(messages[0].mission_type).toBe(MavMissionType.MAV_MISSION_TYPE_FENCE);
});

test('MessageTruncation', async () => { // should truncate target_component and missiont_type
    const msg = new MissionCount(1, 0);
    msg.count = 16;
    msg.target_system = 1;
    msg.target_component = 0;
    msg.mission_type = MavMissionType.MAV_MISSION_TYPE_MISSION;
    const packedMsg = mavlinkModule.pack([msg]);
    // @ts-ignore
    expect(packedMsg.length).toBe(15) // min packet length = 12, count = 2, target_system = 1: 15
});
