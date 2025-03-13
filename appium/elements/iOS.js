// elements/iOS.js

const ElementsBase = require('./ElementsBase')
const Selectors = require('../selectors')

class iOS extends ElementsBase {
  constructor(driver) {
    const selectors = Selectors('ios')
    super(driver, selectors)
  }

  async addQualifiers(locator) {
    const element = locator
    element.rect = await this.driver.getElementRect(element.ELEMENT)
    element.rect.left = element.rect.x
    element.rect.right = element.rect.x + element.rect.width
    element.rect.midx = element.rect.x + element.rect.width / 2
    element.rect.top = element.rect.y
    element.rect.bottom = element.rect.y + element.rect.height
    element.rect.midy = element.rect.y + element.rect.height / 2
    element.tagname = await this.driver.getElementTagName(element.ELEMENT)
    element.visible = JSON.parse(
      await this.driver.getElementAttribute(element.ELEMENT, 'visible'),
    )
    return element
  }
}

module.exports = iOS
