const { log } = require('@nodebug/logger')
const fs = require('fs')
const DeviceBase = require('./DeviceBase')

class macOS extends DeviceBase {
  async activate(packageName) {
    const bundleId = packageName || this.capabilities['appium:bundleId']
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
      const message = `Error while activating the app ${bundleId} to foreground.`
      log.error(message)
      log.error(err.stack)
      err.message = `${message}\n${err.message}`
      throw err
    }
  }

  async terminate(packageName) {
    const bundleId = packageName || this.capabilities['appium:bundleId']
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
      const message = `Error while terminating the app ${bundleId}.`
      log.error(message)
      log.error(err.stack)
      err.message = `${message}\n${err.message}`
      throw err
    }
  }

  async clipboard() {
    log.info(`Getting data from clipboard`)
    try {
      return this.actions.clipboard()
    } catch (err) {
      const message = `Error while getting the contents of device clipboard.`
      log.error(message)
      log.error(err.stack)
      err.message = `${message}\n${err.message}`
      throw err
    }
  }

  async source() {
    log.info(`Getting the app source code`)
    try {
      return this.actions.source()
    } catch (err) {
      const message = `Error while getting app source code.`
      log.error(message)
      log.error(err.stack)
      err.message = `${message}\n${err.message}`
      throw err
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

  async clearAppData(packageName) {
    const bundleId = packageName || this.capabilities['appium:bundleId']
    log.info(`Clearing all data for the app with package name ${bundleId}`)
    try {
      await this.terminate(bundleId)
      await this.actions.executeShellScript(
        `/bin/rm -rf ~/Library/*/group.${bundleId}`,
      )
      log.info(`Deleted app data from ~/Library/*/group.${bundleId}`)
      await this.sleep(this.timeout * 500)
      const a = `find ~/Library/Containers -type d -name '*${bundleId}*' 2>/dev/null`
      let response
      try {
        response = await this.actions.executeShellScript(a)
      } catch (err) {
        response = err.message
      }
      const uuidr =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      const arr = new Set(
        response.split('/').filter((item) => uuidr.test(item)),
      )
      /* eslint-disable no-await-in-loop */
      // eslint-disable-next-line no-restricted-syntax
      for (const containerId of arr) {
        await this.actions.executeShellScript(
          `/bin/rm -rf ~/Library/Containers/${containerId}`,
        )
        log.info(`Deleted app data from ~/Library/Containers/${containerId}`)
        await this.sleep(this.timeout * 500)
      }
      /* eslint-enable no-await-in-loop */
    } catch (err) {
      const message = `Error while clearing the app data for ${bundleId}.`
      log.error(message)
      log.error(err.stack)
      err.message = `${message}\n${err.message}`
      throw err
    }
  }

  async openDeepLink(url, packageName) {
    const bundleId = packageName || this.capabilities['appium:bundleId']
    log.info(`Opening the deep link ${url}`)
    let s
    try {
      await this.actions.deepLink(url)
      await this.sleep(this.timeout * 200)
      s = await this.actions.queryAppState(bundleId)
    } catch (err) {
      const message = `Error while opening the deep link ${url} for app ${bundleId}.`
      log.error(message)
      log.error(err.stack)
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
    log.info(`Getting the file from path ${path}`)
    try {
      const a = `find ~/Library/Containers -type d -name '*${bundleId}*' 2>/dev/null`
      let response
      try {
        response = await this.actions.executeShellScript(a)
      } catch (err) {
        response = err.message
      }
      const uuidr =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
      const arr = new Set(
        response.split('/').filter((item) => uuidr.test(item)),
      )
      let base64
      /* eslint-disable no-await-in-loop */
      // eslint-disable-next-line no-restricted-syntax
      for (const containerId of arr) {
        base64 = await this.actions.executeShellScript(
          `cat ~/Library/Containers/${containerId}/${path} | base64`,
        )
      }
      /* eslint-enable no-await-in-loop */
      return base64
    } catch (err) {
      const message = `Error while getting the file from path ${path} for app ${bundleId}.`
      log.error(message)
      err.message = `${message}\n${err.message}`
      throw err
    }
  }

  async executeAppleScript(script) {
    try {
      await this.actions.executeAppleScript(script)
      await this.sleep(this.timeout * 300)
      log.info(`Executing apple script ${script}`)
      return true
    } catch (err) {
      const message = `Error while executing apple script ${script}.`
      log.error(message)
      err.message = `${message}\n${err.message}`
      throw err
    }
  }
}

module.exports = macOS
