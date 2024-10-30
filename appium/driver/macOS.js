const Strategy = require('./Strategy')

class macOS extends Strategy {
    async initiate() {
        await this.device.stop()
        await this.device.start()
        await this.device.startScreenRecording()
        return true
    }

    async exit() {
        await this.device.stopScreenRecording()
        await this.device.stop()
        return true
    }
}

module.exports = macOS