const ElementsBase = require('./ElementsBase')

class macOS extends ElementsBase {
    constructor(driver) {
        super(driver, 'macos')
    }
}

module.exports = macOS