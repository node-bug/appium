const { log } = require('@nodebug/logger')
const Device = require('../device')
const Toggle = require('../toggle')
const messenger = require('./messenger')

class Strategy {
  constructor(server, capability) {
    this.stack = []
    this.device = Device(server, capability)
    this.toggle = new Toggle(this, capability.platform)
    this.messenger = messenger

    this.timeout = this.device.timeout || 10
    this.RECOVERY_TIME = this.device.timeout * 50
  }

  get videoPath() {
    return this.device.videoPath
  }

  get hasActiveSession() {
    return this.device.hasActiveSession
  }

  get message() {
    return this._message
  }

  set message(value) {
    this._message = value
  }

  exactly() {
    this.stack.push({ exactly: true })
    return this
  }

  within() {
    this.stack.push({ type: 'location', located: 'within' })
    return this
  }

  relativePositioner(position) {
    const description = this.stack.pop()
    if (JSON.stringify(description) === JSON.stringify({ exactly: true })) {
      this.stack.push({ type: 'location', located: position, exactly: true })
    } else {
      if (typeof description !== 'undefined') {
        this.stack.push(description)
      }
      this.stack.push({ type: 'location', located: position, exactly: false })
    }
    return this
  }

  above() {
    return this.relativePositioner('above')
  }

  below() {
    return this.relativePositioner('below')
  }

  toLeftOf() {
    return this.relativePositioner('toLeftOf')
  }

  toRightOf() {
    return this.relativePositioner('toRightOf')
  }

  atIndex(index) {
    if (typeof index !== 'number') {
      throw new TypeError(
        `Expected parameter for atIndex is number. Received ${typeof index} instead`,
      )
    }
    const description = this.stack.pop()
    if (typeof description !== 'undefined') {
      description.index = index
      this.stack.push(description)
    }
    return this
  }

  exact() {
    this.stack.push({ exact: true })
    return this
  }

  element(data) {
    const description = this.stack.pop()
    if (JSON.stringify(description) === JSON.stringify({ exact: true })) {
      this.stack.push({
        type: 'element',
        id: data.toString(),
        exact: true,
        matches: [],
        index: false,
        visible: false,
      })
    } else {
      if (typeof description !== 'undefined') {
        this.stack.push(description)
      }
      this.stack.push({
        type: 'element',
        id: data.toString(),
        exact: false,
        matches: [],
        index: false,
        visible: false,
      })
    }
    return this
  }

  typefixer(data, type) {
    this.element(data)
    const description = this.stack.pop()
    description.type = type
    this.stack.push(description)
    return this
  }

  dialog(data) {
    return this.typefixer(data, 'dialog')
  }

  button(data) {
    return this.typefixer(data, 'button')
  }

  image(data) {
    return this.typefixer(data, 'image')
  }

  switch(data) {
    return this.typefixer(data, 'switch')
  }

  textbox(data) {
    return this.typefixer(data, 'textbox')
  }

  alert(data) {
    return this.typefixer(data, 'alert')
  }

  cell(data) {
    return this.typefixer(data, 'cell')
  }

  menuitem(data) {
    return this.typefixer(data, 'menuitem')
  }

  drag() {
    this.stack.push({ type: 'drag' })
    return this
  }

  /* eslint-disable class-methods-use-this, no-promise-executor-return */
  async sleep(ms) {
    log.info(`Sleeping for ${ms} milliseconds`)
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async waitToRecover(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  /* eslint-enable class-methods-use-this */

  async initiate() {
    throw new Error(`Function ${this.name} "initiate" is not implemented.`)
  }

  async exit() {
    throw new Error(`Function ${this.name} "exit" is not implemented.`)
  }

  async finder() {
    throw new Error(`Function ${this.name} "finder" is not implemented.`)
  }

  async find() {
    throw new Error(`Function ${this.name} "find" is not implemented.`)
  }

  async screenshot() {
    throw new Error(`Function ${this.name} "screenshot" is not implemented.`)
  }

  async longtap() {
    throw new Error(`Function ${this.name} "longtap" is not implemented.`)
  }

  async drop() {
    throw new Error(`Function ${this.name} "drop" is not implemented.`)
  }

  async tap() {
    throw new Error(`Function ${this.name} "tap" is not implemented.`)
  }

  async clear() {
    throw new Error(`Function ${this.name} "clear" is not implemented.`)
  }

  async write() {
    throw new Error(`Function ${this.name} "write(value)" is not implemented.`)
  }

  async isNotDisplayed() {
    throw new Error(
      `Function ${this.name} "isNotDisplayed" is not implemented.`,
    )
  }

  async isDisplayed() {
    throw new Error(`Function ${this.name} "isDisplayed" is not implemented.`)
  }

  async isVisible() {
    throw new Error(`Function ${this.name} "isVisible" is not implemented.`)
  }

  async isEnabled() {
    throw new Error(`Function ${this.name} "isEnabled" is not implemented.`)
  }

  async value() {
    throw new Error(`Function ${this.name} "value" is not implemented.`)
  }

  async swipeUp() {
    throw new Error(`Function ${this.name} "swipeUp" is not implemented.`)
  }

  async swipeDown() {
    throw new Error(`Function ${this.name} "swipeDown" is not implemented.`)
  }

  async scrollIntoView() {
    throw new Error(
      `Function ${this.name} "scrollIntoView" is not implemented.`,
    )
  }

  async scrollAndBringToCenter() {
    throw new Error(
      `Function ${this.name} "scrollAndBringToCenter" is not implemented.`,
    )
  }

  async activate(packageName) {
    return this.device.activate(packageName)
  }

  async terminate(packageName) {
    return this.device.terminate(packageName)
  }

  async uninstall(packageName) {
    return this.device.uninstall(packageName)
  }

  async clipboard() {
    return this.device.clipboard()
  }

  async source() {
    return this.device.source()
  }

  async startScreenRecording() {
    return this.device.startScreenRecording()
  }

  async stopScreenRecording() {
    return this.device.stopScreenRecording()
  }

  async clearAppData() {
    return this.device.clearAppData()
  }

  async openDeepLink(url, packageName) {
    return this.device.openDeepLink(url, packageName)
  }

  async pullFile(packageName, path) {
    return this.device.pullFile(packageName, path)
  }

  async executeAppleScript(script) {
    return this.device.executeAppleScript(script)
  }
}

module.exports = Strategy
