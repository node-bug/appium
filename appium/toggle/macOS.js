const { log } = require('@nodebug/logger')
const ToggleBase = require('./ToggleBase')

class macOS extends ToggleBase {
  async performer(elementId) {
    await this.that.device.driver.executeScript('macos: click', [
      {
        elementId,
        x: 1,
        y: 1,
      },
    ])
    log.info('Clicked on toggle.')
  }
}

module.exports = macOS
