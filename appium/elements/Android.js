// elements/Android.js

const ElementsBase = require('./ElementsBase')
const Selectors = require('../selectors')

class Android extends ElementsBase {
  constructor(driver) {
    const selectors = Selectors('android')
    super(driver, selectors)
  }

  getSelectors(obj) {
    /* eslint-disable prefer-const */
    let xpath = this.selectors.getSelector(obj.id, obj.exact)
    /* eslint-enable prefer-const */
    if (obj.parent) {
      Object.keys(xpath).forEach((key) => {
        if (typeof xpath[key] === 'string') {
          xpath[key] = `${xpath[key]}/..`
        }
      })
    }
    return xpath
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
      await this.driver.getElementAttribute(element.ELEMENT, 'displayed'),
    )
    return element
  }
}

module.exports = Android
