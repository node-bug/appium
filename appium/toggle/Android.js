const { log } = require('@nodebug/logger')
const ToggleBase = require('./ToggleBase')

class Android extends ToggleBase {
  async performer(elementId) {
    await this.that.device.actions.tap(elementId)
    log.info('Tapped on toggle.')
  }
}

module.exports = Android
