const { log } = require('@nodebug/logger')
const fs = require('fs')
const DeviceBase = require('./DeviceBase')

class iOS extends DeviceBase {
  async activate(packageName) {
    const bundleId = packageName || this.capabilities['appium:bundleId']
    if ([undefined, null].includes(bundleId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declated in config file:device.json',
      )
    }
    log.info(`Activating app with package name ${bundleId}`)
    try {
      await this.actions.activate(bundleId)
      await this.sleep(this.timeout * 200)
      if ((await this.actions.queryAppState(bundleId)) === 4) {
        log.info(`App ${bundleId} is activated and moved to foreground`)
        return true
      }
      const message = `App ${bundleId} is not activated and not moved to foreground`
      log.error(message)
      throw new Error(message)
    } catch (err) {
      log.error(`Error while activating the app ${bundleId} to foreground`)
      log.error(err.stack)
      err.message = `Error while activating the app ${bundleId} to foreground.\n${err.message}`
      throw err
    }
  }

  async terminate(packageName) {
    const bundleId = packageName || this.capabilities['appium:bundleId']
    if ([undefined, null].includes(bundleId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declated in config file:device.json',
      )
    }
    log.info(`Terminating app with package name ${bundleId}`)
    try {
      await this.actions.terminate(bundleId)
      await this.sleep(this.timeout * 200)
      if ((await this.actions.queryAppState(bundleId)) === 1) {
        log.info(`App ${bundleId} is terminated successfully`)
        return true
      }
      log.error(`App ${bundleId} is still active`)
      throw new Error(`Could not terminate App ${bundleId}`)
    } catch (err) {
      log.error(`Error while terminating the app ${bundleId}`)
      log.error(err.stack)
      err.message = `Error while terminating the app ${bundleId}.\n${err.message}`
      throw err
    }
  }

  async uninstall(packageName) {
    const bundleId = packageName || this.capabilities['appium:bundleId']
    if ([undefined, null].includes(bundleId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declated in config file:device.json',
      )
    }
    log.info(`Uninstalling app with package name ${bundleId}`)
    try {
      await this.actions.uninstall(bundleId)
      await this.sleep(this.timeout * 200)
      log.info(`App ${bundleId} is uninstalled`)
      return true
    } catch (err) {
      if (this.driver !== undefined) {
        log.error(`Error while uninstalling the app ${bundleId}`)
        log.error(err.stack)
        err.message = `Error while uninstalling the app ${bundleId}.\n${err.message}`
        throw err
      } else {
        log.warn(
          `Tried uninstalling the app ${bundleId}, but appium driver is not available or started.`,
        )
        return true
      }
    }
  }

  async clipboard() {
    log.info(`Getting data from clipboard`)
    try {
      return this.actions.clipboard()
    } catch (err) {
      if (this.driver !== undefined) {
        log.error(`Error while getting the contents of device clipboard`)
        log.error(err.stack)
        err.message = `Error while getting the contents of device clipboard.\n${err.message}`
        throw err
      } else {
        log.warn(
          `Tried getting the contents of device clipboard, but appium driver is not available or started.`,
        )
        return true
      }
    }
  }

  async source() {
    log.info(`Getting the app source code`)
    try {
      return this.actions.source()
    } catch (err) {
      if (this.driver !== undefined) {
        log.error(`Error while getting app source code`)
        log.error(err.stack)
        err.message = `Error while getting app source code.\n${err.message}`
        throw err
      } else {
        log.warn(
          `Tried getting the app source code, but appium driver is not available or started.`,
        )
        return true
      }
    }
  }

  async stopScreenRecording() {
    log.info(`Stopping the screen recording`)
    const video = await this.actions.stopScreenRecording()
    await fs.writeFileSync(this.videoPath, video.payload, 'base64')
  }

  async startScreenRecording() {
    log.info(`Starting the screen recording`)
    return this.actions.startScreenRecording()
  }

  async openDeepLink(url, packageName) {
    const bundleId = packageName || this.capabilities['appium:bundleId']
    if ([undefined, null].includes(bundleId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declated in config file:device.json',
      )
    }
    log.info(`Opening the deep link ${url}`)
    let s
    try {
      await this.actions.deepLink(url)
      await this.sleep(this.timeout * 200)
      s = await this.actions.queryAppState(bundleId)
    } catch (err) {
      const message = `Error while opening the deep link ${url} for app ${bundleId}.`
      log.error(message)
      err.message = `${message}\n${err.message}`
      throw err
    }

    if (s !== 4) {
      throw new Error(
        `Deep link ${url} did not open app. The app ${bundleId} was not activated by the deep link.`,
      )
    } else {
      return true
    }
  }

  async pullFile(packageName, path) {
    const bundleId = packageName || this.capabilities['appium:bundleId']
    if ([undefined, null].includes(bundleId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declated in config file:device.json',
      )
    }
    log.info(`Getting the file from path ${path}`)
    try {
      return this.actions.pullFile(bundleId, path)
    } catch (err) {
      const message = `Error while getting the file from path ${path} for app ${bundleId}.`
      log.error(message)
      err.message = `${message}\n${err.message}`
      throw err
    }
  }
}

module.exports = iOS
