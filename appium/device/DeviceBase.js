const WebDriver = require('webdriver')
const { log } = require('@nodebug/logger')
const Capabilities = require('../capabilities')
const Actions = require('../actions')
const Elements = require('../elements')

class DeviceBase {
  constructor(server, capability) {
    this._driver = null
    this.capabilities = Capabilities(server, capability)
    this.actions = Actions(this.driver, capability.platform)
    this.elements = Elements(this.driver, capability.platform)

    const { hostname, port, path, logLevel, timeout } = server
    this.timeout = timeout || 10
    this.videosDir = server.videoPath || './reports'

    this.options = {
      hostname,
      port,
      path,
      logLevel,
      capabilities: this.capabilities,
      connectionRetryTimeout: this.timeout * 10000,
    }
  }

  get videoPath() {
    return `${this.videosDir}/recording_${process.pid}.mov`
  }

  get udid() {
    return this.driver.capabilities.udid
  }

  get capabilities() {
    return this._capabilities
  }

  set capabilities(value) {
    this._capabilities = value
  }

  get options() {
    return this._options
  }

  set options(value) {
    this._options = value
  }

  get driver() {
    return this._driver
  }

  set driver(value) {
    this._driver = value
  }

  get hasActiveSession() {
    try {
      return ![null, undefined, ''].includes(this.driver.sessionId)
    } catch (err) {
      return false
    }
  }

  async start() {
    try {
      this.driver = await WebDriver.newSession(this.options)
      this.actions.driver = this.driver
      this.elements.driver = this.driver
    } catch (err) {
      if (['Failed to create session.\nfetch failed'].includes(err.message)) {
        const message =
          'Appium session could not be created. Either the Appium server is not started or device does not exist.'
        log.warn(message)
        throw new Error(`${message}\n${err}`)
      } else {
        log.error(err)
        throw err
      }
    }
    ;['SIGINT', 'SIGTERM', 'exit', 'uncaughtException'].forEach((signal) =>
      process.on(signal, async () => {
        try {
          await this.stop()
        } catch (err) {
          log.warn('Error while deleting Appium session.')
          log.error(err)
        }
        await process.exit()
      }),
    )
    return true
  }

  async stop() {
    try {
      const { sessionId } = this.driver
      await this.driver.deleteSession()
      log.info(`Deleted existing session linked to this test run ${sessionId}`)
    } catch (err) {
      if (
        ![
          "Cannot read properties of undefined (reading 'getSession')",
          "Cannot read properties of undefined (reading 'sessionId')",
          "Cannot destructure property 'sessionId' of 'this.driver' as it is undefined.",
          "Cannot destructure property 'sessionId' of 'this.driver' as it is null.",
          'A session is either terminated or not started',
        ].includes(err.message)
      ) {
        log.error(
          `Unrecognized error while deleting existing sessions : ${err.message}`,
        )
      }
    }
    return true
  }

  async activate() {
    throw new Error(
      `Function ${this.name} "activate(packageName)" is not implemented`,
    )
  }

  async terminate() {
    throw new Error(
      `Function ${this.name} "terminate(packageName)" is not implemented`,
    )
  }

  async uninstall() {
    throw new Error(
      `Function ${this.name} "uninstall(packageName)" is not implemented`,
    )
  }

  async clipboard() {
    throw new Error(`Function ${this.name} "clipboard" is not implemented`)
  }

  async source() {
    throw new Error(`Function ${this.name} "source" is not implemented`)
  }

  async startScreenRecording() {
    throw new Error(
      `Function ${this.name} "startScreenRecording" is not implemented`,
    )
  }

  async stopScreenRecording() {
    throw new Error(
      `Function ${this.name} "stopScreenRecording" is not implemented`,
    )
  }

  async clearAppData() {
    throw new Error(`Function ${this.name} "clearAppData" is not implemented`)
  }

  async openDeepLink() {
    throw new Error(
      `Function ${this.name} "openDeepLink(url, packageName)" is not implemented`,
    )
  }

  async pullFile() {
    throw new Error(
      `Function ${this.name} "pullFile(packageName, path)" is not implemented`,
    )
  }

  async executeAppleScript() {
    throw new Error(
      `Function ${this.name} "executeAppleScript(script)" is not implemented`,
    )
  }

  /* eslint-disable class-methods-use-this, no-promise-executor-return */
  async sleep(ms) {
    log.info(`Sleeping for ${ms} milliseconds`)
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  /* eslint-enable class-methods-use-this, no-promise-executor-return */
}

module.exports = DeviceBase
