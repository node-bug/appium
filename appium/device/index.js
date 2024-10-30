const appium = require('@nodebug/config')('appium')
const device = require('@nodebug/config')('device')
const iOS = require('./iOS')
const macOS = require('./macOS')
const Android = require('./Android')

function Device(server = appium, capability = device) {
  switch (capability.platform.toLowerCase()) {
    case 'ios':
      // eslint-disable-next-line new-cap
      return new iOS(server, capability)

    case 'macos':
      // eslint-disable-next-line new-cap
      return new macOS(server, capability)

    case 'android':
      return new Android(server, capability)

    default:
      return new Error(`${capability.platform} is not a known platform name. Known platforms are 'iOS', 'macOS' and 'Android'`)
  }
}

module.exports = Device
