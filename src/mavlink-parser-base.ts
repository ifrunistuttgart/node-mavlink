/*
 * mavlink-parser-base.ts
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
import {ParserState} from "./parser-state.enum";

export abstract class MAVLinkParserBase {
    protected abstract start_marker: number;
    protected abstract minimum_packet_length: number;
    protected expected_packet_length: number = -1;
    private message_factory_tuples: Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]> = new Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]>();

    private state: ParserState = ParserState.WaitingForMagicByte;
    protected buffer: Buffer = Buffer.alloc(0);

    protected constructor() {

    }

    public parse(bytes: Buffer): MAVLinkMessage[] {
        const messages: MAVLinkMessage[] = [];

        if (this.state == ParserState.WaitingForMagicByte) {
            // look for the defined magic byte
            let message_start = bytes.indexOf(this.start_marker);
            if (message_start > -1) {
                this.buffer = bytes.slice(message_start);
                this.state = ParserState.WaitingForHeaderComplete;
            }
        } else {
            this.buffer = Buffer.concat([this.buffer, bytes]);
        }

        if (this.state == ParserState.WaitingForHeaderComplete) {
            if (this.buffer.length >= this.minimum_packet_length) {
                this.state = ParserState.WaitingForMessageComplete;
                this.expected_packet_length = this.calculate_packet_length(
                    this.buffer.slice(0, this.minimum_packet_length));

                if (this.expected_packet_length < 0 || this.expected_packet_length < this.minimum_packet_length) {
                    // something was wrong. drop the magic byte and restart.
                    this.expected_packet_length = -1;
                    this.state = ParserState.WaitingForMagicByte;
                    this.buffer = this.buffer.slice(1);
                }
            }
        }

        if (this.state == ParserState.WaitingForMessageComplete) {
            if (this.buffer.length >= this.expected_packet_length) {
                try {
                    const message = this.parseMessage(this.buffer.slice(0, this.expected_packet_length));
                    if (message) {
                        messages.push(message);
                    }
                } catch (e) {
                    throw e;
                } finally {
                    // something was complete. Regardless of a complete message, drop the magic byte and restart.
                    this.expected_packet_length = -1;
                    this.state = ParserState.WaitingForMagicByte;
                    this.buffer = this.buffer.slice(1);
                }

            }
        }

        return messages;
    }

    protected abstract calculate_packet_length(bytes: Buffer): number;

    protected abstract parseMessage(bytes: Buffer): MAVLinkMessage | undefined;

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
