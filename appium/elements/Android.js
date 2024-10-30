const ElementsBase = require('./ElementsBase')

class Android extends ElementsBase {
    constructor(driver) {
        super(driver, "android")
    }
}

module.exports = Android