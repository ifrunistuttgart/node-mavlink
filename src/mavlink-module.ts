import {MAVLinkPackerBase} from "./mavlink-packer-base";
import {MAVLinkParserBase} from "./mavlink-parser-base";
import {MAVLinkPackerV1} from "./mavlink-v1/mavlink-packer-v1";
import {MAVLinkPackerV2} from "./mavlink-v2/mavlink-packer-v2";
import {MAVLinkMessage} from "./mavlink-message";
import {MAVLinkParserV1} from "./mavlink-v1/mavlink-parser-v1";
import {MAVLinkParserV2} from "./mavlink-v2/mavlink-parser-v2";
import {messageRegistry} from "./message-registry";
import {EventEmitter} from 'events';

export class MAVLinkModule extends EventEmitter {
    private packer: MAVLinkPackerBase;
    private parser: MAVLinkParserBase;

    constructor(private version?: number) {
        super();

        switch (version) {
            case 1:
            default:
                this.packer = new MAVLinkPackerV1();
                this.parser = new MAVLinkParserV1();
                break;
            case 2:
                this.packer = new MAVLinkPackerV2();
                this.parser = new MAVLinkParserV2();
                break;
        }
        this.registerMessages();
    }

    registerMessages() {
        for (const message_factory_tuple of messageRegistry) {
            this.parser.register(message_factory_tuple[0], message_factory_tuple[1]);
        }
    }

    parse(bytes: Buffer) {
        let messages: MAVLinkMessage[];
        this.emit('test', {test: "test"});
        try {
            messages = this.parser.parse(bytes);
            if (messages) {
                for (const message of messages) {
                    this.emit(message._message_name, message);
                    this.emit('message', message);
                }
            }
        } catch (e) {
            this.emit('error', e);
        }
    }

}
