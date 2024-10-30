class ActionsBase {
  constructor(driver) {
    this._driver = driver
  }

  get driver() {
    return this._driver
  }

  set driver(value) {
    this._driver = value
  }

  async terminate() {
    throw new Error(
      `Action ${this.name} "terminate(packageName)" not implemented.`,
    )
  }

  async activate() {
    throw new Error(
      `Action ${this.name} "activate(packageName)" not implemented.`,
    )
  }

  async uninstall() {
    throw new Error(
      `Action ${this.name} "uninstall(packageName)" not implemented.`,
    )
  }

  async queryAppState() {
    throw new Error(
      `Action ${this.name} "queryAppState(packageName)" not implemented.`,
    )
  }

  async clipboard() {
    throw new Error(`Function ${this.name} "clipboard" not implemented.`)
  }

  async source() {
    throw new Error(`Function ${this.name} "source" not implemented.`)
  }

  async stopScreenRecording() {
    throw new Error(
      `Action ${this.name} "stopScreenRecording(path)" not implemented.`,
    )
  }

  async startScreenRecording() {
    throw new Error(
      `Action ${this.name} "startScreenRecording(path)" not implemented.`,
    )
  }

  async screenshot() {
    throw new Error(`Action ${this.name} "screenshot" not implemented.`)
  }

  async elementScreenshot() {
    throw new Error(
      `Action ${this.name} "elementScreenshot(elementId)" not implemented.`,
    )
  }

  async tap() {
    throw new Error(`Action ${this.name} "tap(elementId)" not implemented.`)
  }

  async longTap() {
    throw new Error(`Action ${this.name} "longTap(elementId)" not implemented.`)
  }

  async click() {
    throw new Error(`Action ${this.name} "click(elementId)" not implemented.`)
  }

  async rightClick() {
    throw new Error(
      `Action ${this.name} "rightClick(elementId)" not implemented.`,
    )
  }

  async dragAndDrop() {
    throw new Error(
      `Action ${this.name} "dragAndDrop(fromX, fromY, toX, toY)" not implemented.`,
    )
  }

  async clear() {
    throw new Error(`Action ${this.name} "clear(elementId)" not implemented.`)
  }

  async sendKeys() {
    throw new Error(`Action ${this.name} "sendKeys" not implemented.`)
  }

  async write() {
    throw new Error(
      `Action ${this.name} "write(elementId, value)" not implemented.`,
    )
  }

  async getAttribute() {
    throw new Error(
      `Action ${this.name} "getAttribute(elementId, attribute)" not implemented.`,
    )
  }

  async swipe() {
    throw new Error(
      `Action ${this.name} "swipe(fromX, fromY, toX, toY)" not implemented.`,
    )
  }

  async scrollTo() {
    throw new Error(
      `Action ${this.name} "scrollTo(elementId)" not implemented.`,
    )
  }

  async scroll() {
    throw new Error(
      `Action ${this.name} "scroll(elementId, x, y)" not implemented.`,
    )
  }

  async deepLink() {
    throw new Error(`Action ${this.name} "deepLink(url)" not implemented.`)
  }

  async pullFile() {
    throw new Error(`Action ${this.name} "pullFile(path)" not implemented.`)
  }

  async executeAppleScript() {
    throw new Error(
      `Action ${this.name} "executeAppleScript(script)" not implemented.`,
    )
  }
}

module.exports = ActionsBase
