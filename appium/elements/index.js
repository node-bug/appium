const device = require('@nodebug/config')('device')
const iOS = require('./iOS')
const macOS = require('./macOS')
const Android = require('./Android')

function Elements(driver, platform = device.platform) {
  switch (platform.toLowerCase()) {
    case 'ios':
      // eslint-disable-next-line new-cap
      return new iOS(driver)

    case 'macos':
      // eslint-disable-next-line new-cap
      return new macOS(driver)

    case 'android':
      return new Android(driver)

    default:
      return new Error(`${platform} is not a known platform name. Known platforms are 'iOS', 'macOS' and 'Android'`)
  }
}

module.exports = Elements
