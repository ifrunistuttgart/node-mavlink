import {MAVLinkModule} from "./mavlink-module";
import {MAVLinkMessage} from "./mavlink-message";

export default function f(messageRegistry: Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]>, system_id: number = 1, auto_negotiate: boolean = true) {
    return new MAVLinkModule(messageRegistry, system_id, auto_negotiate);
}

export {MAVLinkModule} from "./mavlink-module";
export {MAVLinkMessage, readInt64LE, readUInt64LE} from "./mavlink-message";
