import {MAVLinkParserBase} from "../mavlink-parser-base";
import {MAVLinkMessage} from "../mavlink-message";

export class MAVLinkParserV2 extends MAVLinkParserBase {
    constructor() {
        super();
    }

    protected start_marker: number = 0xFD;
    protected minimum_packet_length: number = 11;

    public parse(bytes: Buffer): MAVLinkMessage[] {
        return super.parse(bytes);
    }


    protected calculate_packet_length(bytes: Buffer): number {
        return 0;
    }

    protected parseMessage(bytes: Buffer): MAVLinkMessage {
        throw new Error("not implemented");
    }
}
