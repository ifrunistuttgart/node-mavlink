import {MAVLinkModule} from "../mavlink-module";
import {messageRegistry} from "../../assets/message-registry";

beforeAll(() => {
});

afterAll(() => {
});

beforeEach(() => {
});

afterEach(() => {
});

test('MAVLink1NoAutoNegotiation', () => {
    const mavlinkModule = new MAVLinkModule(messageRegistry, 1, false);
    expect(mavlinkModule.protocol_version).toBe(1.0);
});

test('MAVLink1WithAutoNegotiation', () => {
    const mavlinkModule = new MAVLinkModule(messageRegistry, 1);
    expect(mavlinkModule.protocol_version).toBe(1.0);
});

test('MAVLink2Upgraded', () => {
    const mavlinkModule = new MAVLinkModule(messageRegistry, 1);
    mavlinkModule.upgradeLink();
    expect(mavlinkModule.protocol_version).toBe(2.0);
});

test('MAVLink1Downgraded', () => {
    const mavlinkModule = new MAVLinkModule(messageRegistry, 1);
    mavlinkModule.upgradeLink();
    mavlinkModule.downgradeLink();
    expect(mavlinkModule.protocol_version).toBe(1.0);
});
