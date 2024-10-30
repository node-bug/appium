const Strategy = require('./Strategy')

class Android extends Strategy {
    async initiate() {
        await this.device.stop()
        await this.device.start()
        await this.device.startScreenRecording()
    }

    async exit() {
        await this.device.stopScreenRecording()
        await this.device.stop()
    }
}

module.exports = Android