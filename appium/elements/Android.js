const ElementsBase = require('./ElementsBase')
const Selectors = require('../selectors')

class Android extends ElementsBase {
  constructor(driver) {
    const selectors = Selectors('android')
    super(driver, selectors)
  }
}

module.exports = Android
