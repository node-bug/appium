const appium = require('@nodebug/config')('appium')
const device = require('@nodebug/config')('device')
const iOS = require('./iOS')
const Android = require('./Android')
const macOS = require('./macOS')

function Capabilities(server = appium, capability = device) {
  switch (capability.platform.toLowerCase()) {
    case 'ios':
      // eslint-disable-next-line new-cap
      return iOS.capabilities(server, capability)

    case 'macos':
      // eslint-disable-next-line new-cap
      return macOS.capabilities(server, capability)

    case 'android':
      return Android.capabilities(server, capability)

    default:
      throw new Error(
        `${capability.platform} is not a known platform name. Known platforms are 'iOS', 'macOS' and 'Android'`,
      )
  }
}

module.exports = Capabilities
