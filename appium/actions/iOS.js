const ActionsBase = require('./ActionsBase')

class iOS extends ActionsBase {
  async activate(bundleId) {
    return this.driver.executeScript('mobile: activateApp', [
      {
        bundleId,
      },
    ])
  }

  async queryAppState(bundleId) {
    return this.driver.executeScript('mobile: queryAppState', [
      {
        bundleId,
      },
    ])
  }

  async terminate(bundleId) {
    return this.driver.executeScript('mobile: terminateApp', [
      {
        bundleId,
      },
    ])
  }

  async uninstall(bundleId) {
    return this.driver.executeScript('mobile: removeApp', [
      {
        bundleId,
      },
    ])
  }

  async source() {
    return this.driver.executeScript('mobile: source', [
      {
        format: 'xml',
      },
    ])
  }

  async clipboard() {
    return Buffer.from(await this.driver.getClipboard(), 'base64').toString(
      'ascii',
    )
  }

  async stopScreenRecording() {
    return this.driver.executeScript('mobile: stopXCTestScreenRecording', [])
  }

  async startScreenRecording() {
    return this.driver.executeScript('mobile: startXCTestScreenRecording', [])
  }

  async screenshot() {
    return this.driver.takeScreenshot()
  }

  async elementScreenshot(elementId) {
    return this.driver.takeElementScreenshot(elementId)
  }

  async tap(elementId) {
    return this.driver.executeScript('mobile: touchAndHold', [
      {
        elementId,
        duration: 0.2,
      },
    ])
  }

  async longtap(elementId) {
    return this.driver.executeScript('mobile: touchAndHold', [
      {
        elementId,
        duration: 1.6,
      },
    ])
  }

  async write(elementId, value) {
    return this.driver.elementSendKeys(elementId, value)
  }

  async sendKeys(keys) {
    return this.driver.executeScript('mobile: keys', [
      {
        keys,
      },
    ])
  }

  async clear(elementId) {
    return this.driver.elementClear(elementId)
  }

  async getAttribute(elementId, attribute) {
    return this.driver.getElementAttribute(elementId, attribute)
  }

  async dragAndDrop(fromX, fromY, toX, toY) {
    return this.driver.executeScript('mobile: dragFromToWithVelocity', [
      {
        fromX,
        fromY,
        pressDuration: 0.5,
        toX,
        toY,
        holdDuration: 0.1,
        velocity: 400,
      },
    ])
  }

  async swipe(fromX, fromY, toX, toY) {
    return this.driver.executeScript('mobile: dragFromToWithVelocity', [
      {
        pressDuration: 0.1,
        holdDuration: 0.1,
        velocity: 400,
        fromX,
        fromY,
        toX,
        toY,
      },
    ])
  }

  async scrollTo(elementId) {
    return this.driver.executeScript('mobile: scrollToElement', [
      {
        elementId,
      },
    ])
  }

  async deepLink(url) {
    return this.driver.executeScript('mobile: deepLink', [
      {
        url,
      },
    ])
  }

  async pullFile(bundleId, path) {
    return this.driver.pullFile(`@${bundleId}:${path}`)
  }
}

module.exports = iOS
