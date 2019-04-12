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

import {MAVLinkModule} from "./mavlink-module";
import {MAVLinkMessage} from "./mavlink-message";

export default function f(messageRegistry: Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]>, system_id: number = 1, auto_negotiate: boolean = true) {
    return new MAVLinkModule(messageRegistry, system_id, auto_negotiate);
}

export {MAVLinkModule} from "./mavlink-module";
export {MAVLinkMessage, readInt64LE, readUInt64LE} from "./mavlink-message";
