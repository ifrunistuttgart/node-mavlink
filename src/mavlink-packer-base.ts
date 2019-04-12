/*
 * mavlink-packer-base.ts
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

import {MAVLinkMessage} from "./mavlink-message";

export abstract class MAVLinkPackerBase {
    protected abstract start_marker: number;
    private message_factory_tuples: Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]> = new Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]>();

    protected constructor() {

    }

    abstract packMessage(message: MAVLinkMessage): Buffer;

    public register<T extends MAVLinkMessage>(message_id: number, constructorFn: new (system_id: number, component_id: number) => T) {
        this.message_factory_tuples.push([message_id, constructorFn]);
    }

    public instantiateMessage(system_id: number, component_id: number, message_id: number) {
        const message_factory_tuple = this.message_factory_tuples.find(message_factory_tuple => message_factory_tuple[0] == message_id);
        if (message_factory_tuple) {
            const constructorFn: (new (system_id: number, component_id: number) => MAVLinkMessage) = message_factory_tuple[1];
            return new constructorFn(system_id, component_id);
        }
        throw new Error(`Unknown message ID.`);
    }
}
