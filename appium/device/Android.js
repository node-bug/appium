// device/Android.js

const { log } = require('@nodebug/logger')
const fs = require('fs').promises
const path = require('path')
const DeviceBase = require('./DeviceBase')

class Android extends DeviceBase {
  async activate(packageName) {
    const appId = packageName || this.capabilities['appium:appId']
    if ([undefined, null].includes(appId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declated in config file:device.json',
      )
    }
    log.info(`Activating app with package name ${appId}`)
    try {
      await this.actions.activate(appId)
      await this.sleep(this.timeout * 200)
      if ((await this.actions.queryAppState(appId)) === 4) {
        log.info(`App ${appId} is activated and moved to foreground`)
        return true
      }
      const message = `App ${appId} is not activated and not moved to foreground`
      log.error(message)
      throw new Error(message)
    } catch (err) {
      log.error(`Error while activating the app ${appId} to foreground`)
      log.error(err.stack)
      err.message = `Error while activating the app ${appId} to foreground.\n${err.message}`
      throw err
    }
  }

  async terminate(packageName) {
    const appId = packageName || this.capabilities['appium:appId']
    if ([undefined, null].includes(appId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declated in config file:device.json',
      )
    }
    log.info(`Terminating app with package name ${appId}`)
    try {
      await this.actions.terminate(appId)
      await this.sleep(this.timeout * 200)
      if ((await this.actions.queryAppState(appId)) === 1) {
        log.info(`App ${appId} is terminated successfully`)
        return true
      }
      log.error(`App ${appId} is still active`)
      throw new Error(`Could not terminate App ${appId}`)
    } catch (err) {
      log.error(`Error while terminating the app ${appId}`)
      log.error(err.stack)
      err.message = `Error while terminating the app ${appId}.\n${err.message}`
      throw err
    }
  }

  async uninstall(packageName) {
    const appId = packageName || this.capabilities['appium:appId']
    if ([undefined, null].includes(appId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declated in config file:device.json',
      )
    }
    log.info(`Uninstalling app with package name ${appId}`)
    try {
      await this.actions.uninstall(appId)
      await this.sleep(this.timeout * 200)
      log.info(`App ${appId} is uninstalled`)
      return true
    } catch (err) {
      if (this.driver !== undefined) {
        log.error(`Error while uninstalling the app ${appId}`)
        log.error(err.stack)
        err.message = `Error while uninstalling the app ${appId}.\n${err.message}`
        throw err
      } else {
        log.warn(
          `Tried uninstalling the app ${appId}, but appium driver is not available or started.`,
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
    const appId = packageName || this.capabilities['appium:appId']
    if ([undefined, null].includes(appId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declared in config file:device.json',
      )
    }
    log.info(`Opening the deep link ${url}`)
    let s
    try {
      await this.actions.deepLink(url)
      await this.sleep(this.timeout * 200)
      s = await this.actions.queryAppState(appId)
    } catch (err) {
      const message = `Error while opening the deep link ${url} for app ${appId}.`
      log.error(message)
      err.message = `${message}\n${err.message}`
      throw err
    }

    if (s !== 4) {
      throw new Error(
        `Deep link ${url} did not open app. The app ${appId} was not activated by the deep link.`,
      )
    } else {
      return true
    }
  }

  async pullFile(packageName, filePath) {
    const appId = packageName || this.capabilities['appium:appId']
    if ([undefined, null].includes(appId)) {
      throw new Error(
        'PackageName should be passed as function parameter or should be declared in config file:device.json',
      )
    }
    log.info(`Getting the file from path ${path}`)
    try {
      return this.actions.pullFile(appId, filePath)
    } catch (err) {
      const message = `Error while getting the file from path ${path} for app ${appId}.`
      log.error(message)
      err.message = `${message}\n${err.message}`
      throw err
    }
  }

  async pushFile(remotePath, folderName, fileName) {
    log.info(`Pushing the file to path ${remotePath}`)
    try {
      if (
        !remotePath ||
        typeof remotePath !== 'string' ||
        remotePath.trim() === '' ||
        remotePath.startsWith('/') ||
        remotePath.endsWith('/')
      ) {
        throw new Error(
          'Invalid remotePath provided. The remote path should not be empty, start or end with a slash (e.g., path/to/file)',
        )
      }

      if (
        !folderName ||
        typeof folderName !== 'string' ||
        folderName.trim() === '' ||
        folderName.startsWith('/') ||
        folderName.endsWith('/')
      ) {
        throw new Error(
          'Invalid folder name provided. The folder name should not be empty, start or end with a slash (e.g., folder/folder)',
        )
      }

      const fileExtensionRegex = /\.[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*$/
      if (
        !fileName ||
        typeof fileName !== 'string' ||
        fileName.trim() === '' ||
        !fileExtensionRegex.test(fileName)
      ) {
        throw new Error(
          'Invalid fileName provided. The file name should not be empty and must include a valid file extension (e.g., .txt, .jpg, .tar.gz)',
        )
      }

      if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
        throw new Error('Invalid File Name provided')
      }
      const filepath = path.join(process.cwd(), `/${folderName}/`, fileName)
      const fileBuffer = await fs.readFile(filepath)
      const payLoad = fileBuffer.toString('base64')

      await this.actions.pushFile(`${remotePath}/${fileName}`, payLoad)
      return true
    } catch (error) {
      throw new Error(`Error pushing file: ${error.message}`)
    }
  }

  async back() {
    log.info('Click on the device back button')
    return this.actions.pressKeyCode(4)
  }

  async search() {
    log.info('Click on the search button on device keypad')
    this.actions.search()
  }
}

module.exports = Android
