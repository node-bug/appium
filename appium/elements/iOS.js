const ElementsBase = require('./ElementsBase')
const Selectors = require('../selectors')

class iOS extends ElementsBase {
  constructor(driver) {
    const selectors = Selectors('ios')
    super(driver, selectors)
  }
}

module.exports = iOS
