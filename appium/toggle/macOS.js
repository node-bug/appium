const { log } = require('@nodebug/logger')
const ToggleBase = require('./ToggleBase')

class macOS extends ToggleBase {
  async performer(elementId) {
    await this.that.device.actions.click(elementId)
    log.info('Clicked on toggle.')
  }
}

module.exports = macOS
