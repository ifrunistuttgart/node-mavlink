import {MAVLinkMessage} from "../mavlink-message";

export abstract class MAVLinkMessageV2 extends MAVLinkMessage {
    abstract _order_map: number[];

    patchValues(bytes: Buffer): void {
    }

}
