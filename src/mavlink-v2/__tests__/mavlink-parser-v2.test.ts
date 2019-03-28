import {MAVLinkModule} from "../../mavlink-module";
import {ParserState} from "../../parser-state.enum";

let mavlinkModule: MAVLinkModule;

beforeAll(() => {
});

afterAll(() => {
});

beforeEach(() => {
    mavlinkModule = new MAVLinkModule(2);
});

afterEach(() => {
});

test('MessageStart', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF, 0xFD, 0XFE]));
    // @ts-ignore
    expect(mavlinkModule.parser.state).toBe(ParserState.WaitingForHeaderComplete);
});

test('MessageStartTwoPass', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF]));
    mavlinkModule.parse(Buffer.from([0xFD, 0XFE]));
    // @ts-ignore
    expect(mavlinkModule.parser.state).toBe(ParserState.WaitingForHeaderComplete);
});

test('MessageStartNotFound', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF, 0XFE]));
    // @ts-ignore
    expect(mavlinkModule.parser.state).toBe(ParserState.WaitingForMagicByte);
});

test('MessageStartNotFound', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF]));
    // @ts-ignore
    expect(mavlinkModule.parser.state).toBe(ParserState.WaitingForMagicByte);
});

test('MessageStartNotFoundEmptyBuffer', () => {
    mavlinkModule.parse(Buffer.from([0x02, 0x11, 0xFF]));
    // @ts-ignore
    expect(mavlinkModule.parser.buffer.length).toBe(0);
});
