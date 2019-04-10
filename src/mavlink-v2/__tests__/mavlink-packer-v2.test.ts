import {CommandLong} from "../../../assets/messages/command-long";
import {MavCmd} from "../../../assets/enums/mav-cmd";
import {MAVLinkModule} from "../../mavlink-module";

let mavlinkModule: MAVLinkModule;

beforeAll(() => {
});

afterAll(() => {
});

beforeEach(() => {
    mavlinkModule = new MAVLinkModule(1, false);
    mavlinkModule.upgradeLink();
});

afterEach(() => {
});

test('MessagePackUnpack', async () => {
    const cmd = new CommandLong(1, 0);
    cmd.command = MavCmd.MAV_CMD_REQUEST_PROTOCOL_VERSION;
    const messages = await mavlinkModule.parse(mavlinkModule.pack([cmd]));
    // @ts-ignore
    expect(messages[0].command).toBe(MavCmd.MAV_CMD_REQUEST_PROTOCOL_VERSION);
});
