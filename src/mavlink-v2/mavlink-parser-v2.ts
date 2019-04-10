import {MAVLinkParserBase} from "../mavlink-parser-base";
import {MAVLinkMessage, readInt64LE, readUInt64LE} from "../mavlink-message";

export class MAVLinkParserV2 extends MAVLinkParserBase {
    private last_seq: number = 0;

    constructor() {
        super();
    }

    protected start_marker: number = 0xFD;
    protected minimum_packet_length: number = 12;

    protected calculate_packet_length(bytes: Buffer): number {
        return bytes.readUInt8(1) + this.minimum_packet_length;
    }

    protected parseMessage(bytes: Buffer): MAVLinkMessage | undefined {
        const len = bytes.readUInt8(1);
        const incompat_flags = bytes.readUInt8(2);
        const compat_flags = bytes.readUInt8(3);
        const seq = bytes.readUInt8(4);
        const sysid = bytes.readUInt8(5);
        const compid = bytes.readUInt8(6);
        const msgid = bytes.readUIntLE(7, 3);
        if (bytes.length < len + this.minimum_packet_length)
            return undefined;
        const crc = bytes.readUInt16LE(len + this.minimum_packet_length - 2);

        let message;
        try {
            message = this.instantiateMessage(sysid, compid, msgid);

            let actual = message.x25CRC(bytes.slice(1, len + this.minimum_packet_length - 2));
            if (actual !== crc) {
                throw new Error(`CRC error: expected ${crc} but found ${actual}.`);
            }

            if (this.last_seq > 0 && this.last_seq + 1 !== seq) {
                throw new Error(`Packet loss detected.`);
            }

            if (bytes.length < this.minimum_packet_length + len) {
                throw new Error('Not enough bytes in buffer to parse the message.');
            }

            const payload = bytes.slice(this.minimum_packet_length - 2, len + this.minimum_packet_length - 2);

            let start = 0;
            for (const field of message._message_fields) {
                const field_name: string = field[0];
                const field_type: string = field[1];
                const extension_field: boolean = field[2];
                const field_length = message.sizeof(field_type);
                if (payload.length > start + field_length) {
                    message[field_name] = this.read(payload, start, field_type);
                    start += field_length;
                } else { // payload truncation
                    message[field_name] = 0;
                    start += field_length;
                }
            }

            return message;
        } catch (e) {
            throw e;
        }
    }

    private read(bytes: Buffer, start: number, type: string): number | string | undefined {
        switch (type) {
            case "uint8_t":
                return bytes.readUInt8(start);
            case "uint16_t":
                return bytes.readUInt16LE(start);
            case "uint32_t":
                return bytes.readUInt32LE(start);
            case "uint64_t":
                return readUInt64LE(bytes, start);
            case "int8_t":
                return bytes.readInt8(start);
            case "int16_t":
                return bytes.readInt16LE(start);
            case "int32_t":
                return bytes.readInt32LE(start);
            case  "int64_t":
                return readInt64LE(bytes, start);
            case "float":
                return bytes.readFloatLE(start);
            case "double":
                return bytes.readDoubleLE(start);
            case "char":
                return bytes.toString('ascii', start, 1);
        }
    }
}
