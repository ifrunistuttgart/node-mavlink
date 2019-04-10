import {MAVLinkMessage} from "./mavlink-message";

export abstract class MAVLinkPackerBase {
    protected abstract start_marker: number;
    private message_factory_tuples: Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]> = new Array<[number, new (system_id: number, component_id: number) => MAVLinkMessage]>();

    protected constructor() {

    }

    abstract packMessage(message: MAVLinkMessage): Buffer;

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
