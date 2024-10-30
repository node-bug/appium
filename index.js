const server = require('@nodebug/config')('appium')
const capability = require('@nodebug/config')('device')
const Driver = require('./appium/driver')

module.exports = Driver(server, capability)
