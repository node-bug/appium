const device = require('@nodebug/config')('device')
const iOS = require('./iOS')
const macOS = require('./macOS')
const Android = require('./Android')

function Selectors(platform = device.platform) {
  switch (platform.toLowerCase()) {
    case 'ios':
      // eslint-disable-next-line new-cap
      return new iOS()

    case 'macos':
      // eslint-disable-next-line new-cap
      return new macOS()

    case 'android':
      return new Android()

    default:
      return new Error(`${platform} is not a known platform name. Known platforms are 'iOS', 'macOS' and 'Android'`)
  }
}

module.exports = Selectors
