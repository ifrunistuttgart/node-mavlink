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
    _message_fields: string[];
    _crc_extra: number;

    patchValues(bytes: Buffer): void;
}

export interface IIndexable {
    [key: string]: any;
}

export abstract class MAVLinkMessage implements IMAVLinkMessage, IIndexable {
    constructor(public _system_id: number, public _component_id: number) {
    }

    abstract _message_name: string;
    abstract _message_id: number;
    abstract _message_fields: string[];
    abstract _crc_extra: number;

    public abstract patchValues(bytes: Buffer): void;
}
