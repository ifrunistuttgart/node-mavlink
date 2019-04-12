/*
 * mavlink-module.ts
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

import {MAVLinkPackerBase} from "./mavlink-packer-base";
import {MAVLinkParserBase} from "./mavlink-parser-base";
import {MAVLinkPackerV1} from "./mavlink-v1/mavlink-packer-v1";
import {MAVLinkPackerV2} from "./mavlink-v2/mavlink-packer-v2";
import {MAVLinkMessage} from "./mavlink-message";
import {MAVLinkParserV1} from "./mavlink-v1/mavlink-parser-v1";
import {MAVLinkParserV2} from "./mavlink-v2/mavlink-parser-v2";
import {EventEmitter} from 'events';

export class MAVLinkModule extends EventEmitter {
    get protocol_version(): number {
        return this._protocol_version;
    }

    private packer: MAVLinkPackerBase = new MAVLinkPackerV1();
    private parser: MAVLinkParserBase = new MAVLinkParserV1();
    private _protocol_version: number = 1.0;

    constructor(private messageRegistry: Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]>, private system_id: number = 1, auto_negotiate: boolean = true) {
        super();
        this.registerMessages(messageRegistry);
        if (auto_negotiate) {
            setTimeout(() => this.auto_negotiate(), 1000);
        }
    }

    registerMessages(messageRegistry: Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]>) {
        for (const message_factory_tuple of messageRegistry) {
            this.parser.register(message_factory_tuple[0], message_factory_tuple[1]);
            this.packer.register(message_factory_tuple[0], message_factory_tuple[1]);
        }
    }

    pack(messages: MAVLinkMessage[]): Buffer {
        let buffer = Buffer.alloc(0);
        for (const message of messages) {
            buffer = Buffer.concat([buffer, this.packer.packMessage(message)]);
        }
        return buffer;
    }

    async parse(bytes: Buffer): Promise<MAVLinkMessage[]> {
        let messages: MAVLinkMessage[];
        this.emit('test', {test: "test"});
        try {
            messages = this.parser.parse(bytes);
            if (messages) {
                for (const message of messages) {
                    this.emit(message._message_name, message);
                    this.emit('message', message);
                }
            }
            return messages;
        } catch (e) {
            this.emit('error', e);
        }
        return [];
    }

    public upgradeLink() {
        console.log('Upgrading link to MAVLink 2.0');
        this._protocol_version = 2.0;
        this.packer = new MAVLinkPackerV2();
        this.parser = new MAVLinkParserV2();
        this.registerMessages(this.messageRegistry);
    }

    public downgradeLink() {
        console.log('Downgrading link to MAVLink 1.0');
        this._protocol_version = 1.0;
        this.packer = new MAVLinkPackerV1();
        this.parser = new MAVLinkParserV1();
        this.registerMessages(this.messageRegistry);
    }

    private async auto_negotiate() {
        if (this._protocol_version === 1.0) {
            // Hard-coded to remove dependency on assets
            const cmd = this.packer.instantiateMessage(0,0,76); // COMMAND_LONG
            cmd['command'] = 519; // MAV_CMD_REQUEST_PROTOCOL_VERSION

            let timer: NodeJS.Timeout;
            this.on('PROTOCOL_VERSION', function (message) {
                console.log('Received PROTOCOL_VERSION. Handshake complete.');
                clearTimeout(timer);
            });
            const bytes = this.packer.packMessage(cmd);
            timer = setTimeout(() => this.downgradeLink(), 1000);
            this.upgradeLink();
            this.emit(cmd._message_name, bytes);
        }
    }
}
