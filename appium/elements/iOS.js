const ElementsBase = require('./ElementsBase')

class iOS extends ElementsBase {
    constructor(driver) {
        super(driver, 'ios')
    }
}

module.exports = iOS