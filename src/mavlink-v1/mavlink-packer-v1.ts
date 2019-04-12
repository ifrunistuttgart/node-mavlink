/*
 * mavlink-packer-v1.ts
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

import {MAVLinkPackerBase} from "../mavlink-packer-base";
import {MAVLinkMessage, writeInt64LE, writeUInt64LE} from "../mavlink-message";

export class MAVLinkPackerV1 extends MAVLinkPackerBase {
    protected start_marker: number = 0xFE;
    protected minimum_packet_length: number = 8;

    constructor() {
        super();
    }

    packMessage(message: MAVLinkMessage): Buffer {
        const buffer = Buffer.alloc(this.minimum_packet_length + message._payload_length);
        buffer.writeUInt8(this.start_marker, 0);
        buffer.writeUInt8(message._payload_length, 1);
        buffer.writeUInt8(0, 2);
        buffer.writeUInt8(message._system_id, 3);
        buffer.writeUInt8(message._component_id, 4);
        buffer.writeUInt8(message._message_id, 5);

        let start = 0;
        for (const field of message._message_fields) {
            const field_name: string = field[0];
            const field_type: string = field[1];
            const extension_field: boolean = field[2];
            const field_length = message.sizeof(field_type);
            if (!extension_field) {
                this.write(buffer, message[field_name], start + this.minimum_packet_length - 2, field_type);
                start += field_length;
            }
        }

        let actual = message.x25CRC(buffer.slice(1, this.minimum_packet_length + message._payload_length - 2));

        buffer.writeUInt16LE(actual, this.minimum_packet_length + message._payload_length - 2);
        return buffer;
    }

    private write(bytes: Buffer, message_field: any, start: number, type: string) {
        switch (type) {
            case "uint8_t":
                return bytes.writeUInt8(message_field, start);
            case "uint16_t":
                return bytes.writeUInt16LE(message_field, start);
            case "uint32_t":
                return bytes.writeUInt32LE(message_field, start);
            case "uint64_t":
                return writeUInt64LE(bytes, message_field, start);
            case "int8_t":
                return bytes.writeInt8(message_field, start);
            case "int16_t":
                return bytes.writeInt16LE(message_field, start);
            case "int32_t":
                return bytes.writeInt32LE(message_field, start);
            case  "int64_t":
                return writeInt64LE(bytes, message_field, start);
            case "float":
                return bytes.writeFloatLE(message_field, start);
            case "double":
                return bytes.writeDoubleLE(message_field, start);
            case "char":
                return bytes.write(message_field, start, 1, 'ascii');
        }

    }
}
