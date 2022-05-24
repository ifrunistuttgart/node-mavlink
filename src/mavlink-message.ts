/*
 * mavlink-message.ts
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

export function readUInt64LE(buffer: Buffer, offset: number): number {
    // adapted from https://github.com/dannycoates/int53
    offset = offset || 0;
    var low = buffer.readUInt32LE(offset);
    var high = buffer.readUInt32LE(offset + 4);
    return toDouble(high, low, false)
}

export function readInt64LE(buffer: Buffer, offset: number): number {
    // adapted from https://github.com/dannycoates/int53
    offset = offset || 0;
    var low = buffer.readUInt32LE(offset);
    var high = buffer.readUInt32LE(offset + 4);
    return toDouble(high, low, true)
}

export function writeInt64LE(buffer: Buffer, value: number, offset: number): void {
    offset = offset || 0;
    var hl = intHighLow(value);
    buffer.writeUInt32LE(hl[1], offset);
    buffer.writeUInt32LE(hl[0], offset + 4);
}

export function writeUInt64LE(buffer: Buffer, value: number, offset: number): void {
    offset = offset || 0;
    var hl = uintHighLow(value);
    buffer.writeUInt32LE(hl[1], offset);
    buffer.writeUInt32LE(hl[0], offset + 4);
}

function intHighLow(value: number) {
    const MAX_UINT32 = 0x00000000FFFFFFFF;
    if (value > -1) {
        return uintHighLow(value)
    }
    const hl = uintHighLow(-value);
    let high = onesComplement(hl[0]);
    let low = onesComplement(hl[1]);
    if (low === MAX_UINT32) {
        high += 1;
        low = 0
    } else {
        low += 1
    }
    return [high, low]
}

function uintHighLow(value: number) {
    const MAX_UINT32 = 0x00000000FFFFFFFF;
    const MAX_INT53 = 0x001FFFFFFFFFFFFF;
    assert(() => value > -1 && value <= MAX_INT53, "number out of range");
    assert(() => Math.floor(value) === value, "number must be an integer");
    let high = 0;
    const signbit = value & 0xFFFFFFFF;
    const low = signbit < 0 ? (value & 0x7FFFFFFF) + 0x80000000 : signbit;
    if (value > MAX_UINT32) {
        high = (value - low) / (MAX_UINT32 + 1);
    }
    return [high, low]
}

function toDouble(high: number, low: number, signed: boolean) {
    // adapted from https://github.com/dannycoates/int53
    const MAX_UINT32 = 0x00000000FFFFFFFF;

    if (signed && (high & 0x80000000) !== 0) {
        high = onesComplement(high);
        low = onesComplement(low);
        assert(() => high < 0x00200000, "number too small");
        return -((high * (MAX_UINT32 + 1)) + low + 1)
    } else { //positive
        assert(() => high < 0x00200000, "number too large");
        return (high * (MAX_UINT32 + 1)) + low
    }
}

function assert(test: () => boolean, message: string) {
    // adapted from https://github.com/dannycoates/int53
    if (!test) throw new Error(message)
}

function onesComplement(number: number) {
    // adapted from https://github.com/dannycoates/int53
    number = ~number;
    if (number < 0) {
        number = (number & 0x7FFFFFFF) + 0x80000000
    }
    return number
}

export interface IMAVLinkMessage {
    _system_id: number;
    _component_id: number;
    _message_id: number;
    _message_name: string;
    _message_fields: [string, string, boolean][];
    _payload_length: number;
    _crc_extra: number;
    _extension_length: number;

    sizeof(type: string): number;
}

export interface IIndexable {
    [key: string]: any;
}

export abstract class MAVLinkMessage implements IMAVLinkMessage, IIndexable {
    public constructor(public _system_id: number, public _component_id: number) {
    }

    abstract _message_name: string;
    abstract _message_id: number;
    abstract _message_fields: [string, string, boolean][];
    abstract _crc_extra: number;

    get _payload_length(): number {
        let length = 0;
        for (let field of this._message_fields.filter(field => !field[2])) {
            length += this.sizeof(field[1]);
        }
        return length;
    }

    get _extension_length(): number {
        let length = 0;
        for (let field of this._message_fields.filter(field => field[2])) {
            length += this.sizeof(field[1]);
        }
        return length;
    }

    [key: string]: any;

    public sizeof(type: string): number {
        switch (type) {
            case "char":
            case "uint8_t":
            case "int8_t":
                return 1;
            case "uint16_t":
            case "int16_t":
                return 2;
            case "uint32_t":
            case "int32_t":
                return 4;
            case  "int64_t":
            case "uint64_t":
                return 8;
            case "float":
                return 4;
            case "double":
                return 8;
            default:
                return 0;
        }

    }

    public x25CRC(bytes: Buffer) {
        let crc = 0xffff;
        bytes.forEach(function (b) {
            let tmp = (b & 0xff) ^ (crc & 0xff);
            tmp ^= tmp << 4;
            tmp &= 0xff;
            crc = (crc >> 8) ^ (tmp << 8) ^ (tmp << 3) ^ (tmp >> 4);
            crc &= 0xffff;
        });

        if (this._crc_extra) {
            let tmp = (this._crc_extra & 0xff) ^ (crc & 0xff);
            tmp ^= tmp << 4;
            tmp &= 0xff;
            crc = (crc >> 8) ^ (tmp << 8) ^ (tmp << 3) ^ (tmp >> 4);
            crc &= 0xffff;
        }
        return crc;
    }
}
