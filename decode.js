var hex = "021a0107"
var buf = Buffer.from(hex, 'hex')

var cursor = 0;
var buffer;

function Decoder(bytes, port) {

    buffer = bytes;

    if (bytes.length < 2) {
        return {};
    }

    var header = u8();
    var voltage = u8() / 10;
    var count = (bytes.length - 2) / 2;

    var temperatures = [];

    for (var i = 0; i < count; i++) {
        temperatures.push(s16() / 10);
    }

    return {
        header: header,
        voltage: voltage,
        temperatures: temperatures
    };
}

function u8() {
    var value = buffer.slice(cursor);
    value = value[0];
    cursor = cursor + 1;
    return value;
}

function s16() {
    var value = buffer.slice(cursor);
    value = value[1] | value[0] << 8;
    if ((value & (1 << 15)) > 0) {
        value = (~value & 0xffff) + 1;
        value = -value;
    }
    cursor = cursor + 2;
    return value;
}

console.log(JSON.stringify(Decoder(buf, 1234)));
