const { log } = require('@nodebug/logger')
const fs = require('fs')
const DeviceBase = require('./DeviceBase')

class iOS extends DeviceBase {
    async activate(packageName) {
        try {
            await this.actions.activate(packageName)
            await this.sleep(1000)
            if ((await this.actions.queryAppState(packageName)) === 4) {
                log.info(`App ${packageName} is activated and moved to foreground`)
                return true
            } else {
                const message = `App ${packageName} is not activated and not moved to foreground`
                log.error(message)
                throw new Error(message)
            }
        } catch (err) {
            log.error(`Error while activating the app ${packageName} to foreground`)
            log.error(err.stack)
            err.message = `Error while activating the app ${packageName} to foreground.\n${err.message}`
            throw err
        }
    }

    async terminate(packageName) {
        try {
            await this.actions.terminate(packageName)
            await this.sleep(1000)
            if ((await this.actions.queryAppState(packageName)) === 1) {
                log.info(`App ${packageName} is terminated successfully`)
                return true
            } else {
                log.error(`App ${packageName} is still active`)
                throw new Error(`Could not terminate App ${packageName}`)
            }
        } catch (err) {
            log.error(`Error while terminating the app ${packageName}`)
            log.error(err.stack)
            err.message = `Error while terminating the app ${packageName}.\n${err.message}`
            throw err
        }
    }

    async uninstall(packageName) {
        try {
            await this.actions.uninstall(packageName)
            log.info(`App ${packageName} is uninstalled`)
            return true
        } catch (err) {
            if (this.driver !== undefined) {
                log.error(`Error while uninstalling the app ${packageName}`)
                log.error(err.stack)
                err.message = `Error while uninstalling the app ${packageName}.\n${err.message}`
                throw err
            } else {
                log.warn(`Tried uninstalling the app ${packageName}, but appium driver is not available or started.`)
                return true
            }
        }
    }

    async clipboard() {
        try {
            return this.actions.clipboard()
        } catch (err) {
            if (this.driver !== undefined) {
                log.error(`Error while getting the contents of device clipboard`)
                log.error(err.stack)
                err.message = `Error while getting the contents of device clipboard.\n${err.message}`
                throw err
            } else {
                log.warn(`Tried getting the contents of device clipboard, but appium driver is not available or started.`)
                return true
            }
        }
    }

    async source() {
        try {
            return this.actions.source()
        } catch (err) {
            if (this.driver !== undefined) {
                log.error(`Error while getting app source code`)
                log.error(err.stack)
                err.message = `Error while getting app source code.\n${err.message}`
                throw err
            } else {
                log.warn(`Tried getting the app source code, but appium driver is not available or started.`)
                return true
            }
        }
    }

    async stopScreenRecording() {
        const video = await this.actions.stopScreenRecording()
        await fs.writeFileSync(this.videoPath, video.payload, 'base64')
    }

    async startScreenRecording() {
        return this.actions.startScreenRecording()
    }
}

module.exports = iOS