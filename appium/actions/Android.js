const ActionsBase = require('./ActionsBase')

class Android extends ActionsBase {
    async activate(appId) {
        return this.driver.executeScript('mobile: activateApp', { appId })
    }

    async queryAppState(appId) {
        return this.driver.executeScript('mobile: queryAppState', { appId })
    }

    async terminate(appId) {
        return this.driver.executeScript('mobile: terminateApp', { appId })
    }

    async uninstall(appId) {
        return this.driver.executeScript('mobile: removeApp', { appId })
    }

    async source() {
        return this.driver.execute('mobile: source', { format: 'xml' });
    }

    async clipboard() {
        return Buffer.from(await this.driver.getClipboard(), 'base64').toString('ascii')
    }

    async startScreenRecording() {
        return this.driver.executeScript('mobile: startScreenStreaming', {})
    }

    async stopScreenRecording() {
        return this.driver.executeScript('mobile: stopScreenStreaming', {})
    }

    async screenshot() {
        return this.driver.takeScreenshot()
    }

    async elementScreenshot(elementId) {
        return this.driver.takeElementScreenshot(elementId)
    }

    async tap(elementId, duration = 200) {
        return this.driver.executeScript('mobile: clickGesture', {
            elementId,
            duration
        })
    }

    async longtap(elementId, duration = 1600) {
        return this.driver.executeScript('mobile: longClickGesture', {
            elementId,
            duration
        })
    }

    async write(elementId, value) {
        return this.driver.elementSendKeys(elementId, value)
    }

    async sendKeys(keys) {
        return this.driver.executeScript('mobile: type', { keys })
    }

    async clear(elementId) {
        return this.driver.elementClear(elementId)
    }

    async getAttribute(elementId, attribute) {
        return this.driver.getElementAttribute(elementId, attribute)
    }

    async dragAndDrop(elementId, fromX, fromY, toX, toY, speed = 1000) {
        return this.driver.executeScript('mobile: dragGesture', {
            elementId,
            startX: fromX,
            startY: fromY,
            endX: toX,
            endY: toY,
            speed
        })
    }

    async swipe(elementId, direction, percent = 0.8) {
        if (!["up", "down", "left", "right"].includes(direction)) {
            throw new Error("Invalid swipe direction. Use 'up', 'down', 'left', or 'right'.")
        }
        
        return this.driver.executeScript('mobile: swipeGesture', {
            elementId,
            direction,
            percent
        })
    }

    async scrollTo(elementId, strategy = 'accessibility id', maxSwipes = 10) {
        return this.driver.executeScript('mobile: scroll', {
            elementId,
            strategy,
            maxSwipes
        })
    }

    async deepLink(url) {
        return this.driver.executeScript('mobile: deepLink', { url })
    }

    async pullFile(remotePath) {
        return this.driver.executeScript('mobile: pullFile', { remotePath })
    }
}

module.exports = Android
