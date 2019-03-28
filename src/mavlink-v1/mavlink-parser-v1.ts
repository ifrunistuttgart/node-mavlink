import {MAVLinkParserBase} from "../mavlink-parser-base";
import {MAVLinkMessage} from "../mavlink-message";

export class MAVLinkParserV1 extends MAVLinkParserBase {
    private last_seq: number = 0;

    constructor() {
        super();
    }

    protected start_marker: number = 0xFE;
    protected minimum_packet_length: number = 8;

    protected calculate_packet_length(bytes: Buffer): number {
        return bytes.readUInt8(1) + this.minimum_packet_length;
    }

    protected parseMessage(bytes: Buffer): MAVLinkMessage {
        const len = bytes.readUInt8(1);
        const seq = bytes.readUInt8(2);
        const sysid = bytes.readUInt8(3);
        const compid = bytes.readUInt8(4);
        const msgid = bytes.readUInt8(5);
        const crc = bytes.readUInt16LE(6 + len);

        let message;
        try {
            message = this.instantiateMessage(sysid, compid, msgid);

            let actual = this.x25CRC(bytes.slice(1, len + this.minimum_packet_length - 2), message._crc_extra);
            if (actual !== crc) {
                throw new Error(`CRC error: expected ${crc} but found ${actual}.`);
            }

            if (this.last_seq > 0 && this.last_seq + 1 !== seq) {
                throw new Error(`Packet loss detected.`);
            }

            if (bytes.length < this.minimum_packet_length + len) {
                throw new Error('Not enough bytes in buffer to parse the message.');
            }

            const payload = bytes.slice(6, len + this.minimum_packet_length - 2);
            message.patchValues(payload);

            return message;
        } catch (e) {
            throw e;
        }
    }
}
