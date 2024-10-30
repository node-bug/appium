const ActionsBase = require('./ActionsBase')

class macOS extends ActionsBase {
  async activate(bundleId) {
    return this.driver.executeScript('macos: activateApp', [
      {
        bundleId,
      },
    ])
  }

  async queryAppState(bundleId) {
    return this.driver.executeScript('macos: queryAppState', [
      {
        bundleId,
      },
    ])
  }

  async terminate(bundleId) {
    return this.driver.executeScript('macos: terminateApp', [
      {
        bundleId,
      },
    ])
  }

  async source() {
    return this.driver.executeScript('macos: source', [
      {
        format: 'xml',
      },
    ])
  }

  async clipboard() {
    const content = await this.driver.executeScript('macos: appleScript', [
      {
        script: 'return the clipboard',
      },
    ])
    // const match = content.match(/data url ([0-9a-fA-F]+)/)[1]
    // if (match !== undefined) {
    //   return Buffer.from(match, 'hex').toString('utf-8')
    // }
    return content
  }

  async stopScreenRecording() {
    return this.driver.executeScript('macos: stopRecordingScreen', [])
  }

  async startScreenRecording() {
    return this.driver.executeScript('macos: startRecordingScreen', [
      {
        deviceId: 1,
      },
    ])
  }

  async screenshot() {
    // return this.driver.executeScript('macos: appleScript', [
    //     {
    //         command: `do shell script \`osascript -e 'set screenshotBase64 to do shell script
    // "screencapture -x -c && /usr/bin/pbpaste | /usr/bin/base64"' -e 'return screenshotBase64'\``,
    //     },
    // ])
    const x = await this.driver.executeScript('macos: screenshots', [])
    const { payload } = Object.entries(x).find(
      (item) => item[1].isMain === true,
    )[1]
    return payload
  }

  async click(elementId) {
    return this.driver.executeScript('macos: click', [
      {
        elementId,
      },
    ])
  }

  async rightClick(elementId) {
    return this.driver.executeScript('macos: rightClick', [
      {
        elementId,
      },
    ])
  }

  async write(elementId, value) {
    return this.driver.elementSendKeys(elementId, value)
  }

  async sendKeys(keys) {
    return this.driver.executeScript('macos: keys', [
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

  async dragAndDrop(startX, startY, endX, endY) {
    return this.driver.executeScript('macos: clickAndDrag', [
      {
        startX,
        startY,
        duration: 1,
        endX,
        endY,
      },
    ])
  }

  async scroll(elementId, deltaX, deltaY) {
    return this.driver.executeScript('macos: scroll', [
      {
        elementId,
        deltaX,
        deltaY,
      },
    ])
  }

  async executeShellScript(command) {
    return this.driver.executeScript('macos: appleScript', [
      {
        command: `do shell script "${command}"`,
      },
    ])
  }

  async executeAppleScript(script) {
    return this.driver.executeScript('macos: appleScript', [
      {
        script,
      },
    ])
  }

  async deepLink(url) {
    return this.driver.executeScript('macos: deepLink', [
      {
        url,
      },
    ])
  }
}

module.exports = macOS
