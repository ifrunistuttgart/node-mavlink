[![Build Status](https://travis-ci.org/ifrunistuttgart/node-mavlink.svg?branch=master)](https://travis-ci.org/ifrunistuttgart/node-mavlink)
[![Coverage Status](https://coveralls.io/repos/github/ifrunistuttgart/node-mavlink/badge.svg?branch=master)](https://coveralls.io/github/ifrunistuttgart/node-mavlink?branch=master)
# node-mavlink
node-mavlink is a library for parsing and packing MAVLink 2 messages using TypeScript or, when transpiled, using JavaScript in NodeJS. This project is an typed alternative for [node-mavlink](https://github.com/omcaree/node-mavlink) with the additional support of MAVLink2.
### Limitations
At this point, message signing is not supported.
## Installation
I will try to publish the module on npm. Until then, you need to download the package and install it with:

    npm install node-mavlink-0.1.0.tgz

## Usage
To be able to use this module, the MAVLink message definitions need to be parsed using our fork of [pymavlink](https://github.com/ifrunistuttgart/pymavlink), which creates the TypeScript classes.
Using the command-line interface, the classes can be generated using:

    python tools

## Examples
### TypeScript

    enter code here

### JavaScript
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTE3MTYwNjA3ODVdfQ==
-->