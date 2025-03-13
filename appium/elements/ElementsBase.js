class ElementsBase {
  constructor(driver, selectors) {
    this._driver = driver
    this.selectors = selectors
  }

  get driver() {
    return this._driver
  }

  set driver(value) {
    this._driver = value
  }

  getSelectors(obj) {
    return this.selectors.getSelector(obj.id, obj.exact)
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

  async findElements(elementData) {
    const c = []
    let matches = []
    let elements

    elements = await this.driver.findElements(
      'xpath',
      this.getSelectors(elementData)[elementData.type],
    )
    /* eslint-disable no-await-in-loop */
    // eslint-disable-next-line no-restricted-syntax
    for (const element of elements) {
      const match = await this.addQualifiers(element)
      matches.push(match)
    }
    /* eslint-enable no-await-in-loop */

    if (elements.length <= 0 && !['element'].includes(elementData.type)) {
      elements = await this.driver.findElements(
        'xpath',
        this.getSelectors(elementData).element,
      )
      /* eslint-disable no-await-in-loop */
      // eslint-disable-next-line no-restricted-syntax
      for (const element of elements) {
        const locator = await this.addQualifiers(element)
        const match = await this.nearestElement(locator, elementData.type)
        matches.push(match)
      }
      /* eslint-enable no-await-in-loop */
      matches = matches.filter((d) => d !== undefined)
    }

    c.push(
      ...matches.filter(
        (e) =>
          e.rect.height > 0 &&
          e.rect.width > 0 &&
          (!elementData.visible || e.visible),
      ),
    )
    return c
  }

  async nearestElement(locator, type = null) {
    let tagnames = []
    let elements = []
    let matches = []
    if (['write'].includes(type)) {
      tagnames = this.selectors.tagnames.textbox
    } else if (['toggle'].includes(type)) {
      tagnames = this.selectors.tagnames.switch
    } else if (
      [
        'button',
        'dialog',
        'radio',
        'image',
        'switch',
        'textbox',
        'alert',
        'cell',
        'menuitem',
      ].includes(type)
    ) {
      tagnames = this.selectors.tagnames[type]
    }

    if (tagnames.includes(locator.tagname)) {
      return locator
    }
    /* eslint-disable no-await-in-loop */
    // eslint-disable-next-line no-restricted-syntax
    for (const tagname of tagnames) {
      const matchs = await this.driver.findElements('xpath', `//${tagname}`)
      elements = [...elements, ...matchs]
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const element of elements) {
      const match = await this.addQualifiers(element)
      match.distance = Math.sqrt(
        (match.rect.midx - locator.rect.midx) ** 2 +
          (match.rect.y - locator.rect.y) ** 2,
      )
      matches.push(match)
    }
    /* eslint-enable no-await-in-loop */
    matches = matches.filter((e) => !locator.visible || e.visible)
    matches.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
    return matches[0]
  }

  /* eslint-disable class-methods-use-this */
  async relativeSearch(item, rel, relativeElement) {
    if ([undefined, null, ''].includes(rel)) {
      return item.matches
    }
    if ([undefined, null, ''].includes(rel.located)) {
      return item.matches
    }

    let elements
    if (![undefined, null, ''].includes(relativeElement)) {
      switch (rel.located) {
        case 'above':
          if (rel.exactly === true) {
            elements = item.matches.filter(
              (element) =>
                relativeElement.rect.top + 2 >= element.rect.bottom &&
                relativeElement.rect.left - 5 <= element.rect.left &&
                relativeElement.rect.right + 5 >= element.rect.right,
            )
          } else {
            elements = item.matches.filter(
              (element) => relativeElement.rect.top + 2 >= element.rect.bottom,
            )
          }
          break
        case 'below':
          if (rel.exactly === true) {
            elements = item.matches.filter(
              (element) =>
                relativeElement.rect.bottom - 2 <= element.rect.top &&
                relativeElement.rect.left - 5 <= element.rect.left &&
                relativeElement.rect.right + 5 >= element.rect.right,
            )
          } else {
            elements = item.matches.filter(
              (element) => relativeElement.rect.bottom - 2 <= element.rect.top,
            )
          }
          break
        case 'toLeftOf':
          if (rel.exactly === true) {
            elements = item.matches.filter(
              (element) =>
                relativeElement.rect.left + 2 >= element.rect.right &&
                relativeElement.rect.top - 5 <= element.rect.top &&
                relativeElement.rect.bottom + 5 >= element.rect.bottom,
            )
          } else {
            elements = item.matches.filter(
              (element) => relativeElement.rect.left + 2 >= element.rect.right,
            )
          }
          break
        case 'toRightOf':
          if (rel.exactly === true) {
            elements = item.matches.filter(
              (element) =>
                relativeElement.rect.right - 2 <= element.rect.left &&
                relativeElement.rect.top - 5 <= element.rect.top &&
                relativeElement.rect.bottom + 5 >= element.rect.bottom,
            )
          } else {
            elements = item.matches.filter(
              (element) => relativeElement.rect.right - 2 <= element.rect.left,
            )
          }
          break
        case 'within':
          elements = item.matches.filter(
            (element) =>
              relativeElement.rect.left <= element.rect.midx &&
              relativeElement.rect.right >= element.rect.midx &&
              relativeElement.rect.top <= element.rect.midy &&
              relativeElement.rect.bottom >= element.rect.midy,
          )
          break
        default:
          throw new ReferenceError(`Location '${rel.located}' is not supported`)
      }
    } else {
      throw new ReferenceError(
        `Location '${rel.located}' cannot be found as relative element is '${relativeElement}'`,
      )
    }

    return elements
  }
  /* eslint-enable class-methods-use-this */

  async resolveElements(stack) {
    const items = []

    /* eslint-disable no-await-in-loop */
    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < stack.length; i++) {
      const item = { ...stack[i] }
      if (
        [
          'element',
          'button',
          'dialog',
          'radio',
          'image',
          'switch',
          'textbox',
          'alert',
          'cell',
          'menuitem',
        ].includes(item.type) &&
        item.matches.length < 1
      ) {
        item.matches = await this.findElements(item)
      }
      items.push(item)
    }
    /* eslint-enable no-await-in-loop */
    return items
  }

  async find(stack, action) {
    const data = await this.resolveElements(stack)

    let element = null
    /* eslint-disable no-await-in-loop */
    for (let i = data.length - 1; i > -1; i--) {
      const item = data[i]
      if (
        [
          'element',
          'button',
          'dialog',
          'radio',
          'image',
          'switch',
          'textbox',
          'alert',
          'cell',
          'menuitem',
        ].includes(item.type)
      ) {
        const elements = await this.relativeSearch(item)
        if (item.index !== false) {
          element = elements[item.index - 1]
        } else {
          ;[element] = elements
        }
        if ([undefined, null, ''].includes(element)) {
          throw new ReferenceError(
            `'${item.id}' has no matching elements on screen.`,
          )
        }
      } else if (item.type === 'location') {
        i -= 1
        const elements = await this.relativeSearch(data[i], item, element)
        if (data[i].index !== false) {
          element = elements[data[i].index - 1]
        } else {
          ;[element] = elements
        }
        if ([undefined, null, ''].includes(element)) {
          throw new ReferenceError(
            `'${data[i].id}' ${item.located} '${
              data[i + 2].id
            }' has no matching elements on screen.`,
          )
        }
      }
    }
    /* eslint-enable no-await-in-loop */

    if (action !== null) {
      element = await this.nearestElement(element, action)
    }
    if (
      ['textbox'].includes(stack[0].type) &&
      !this.selectors.tagnames.textbox.includes(element.tagname)
    ) {
      element = await this.nearestElement(element, 'write')
    }

    return element
  }

  async findAll(stack) {
    const data = await this.resolveElements(stack)

    let element = null
    /* eslint-disable no-await-in-loop */
    for (let i = data.length - 1; i > -1; i--) {
      const item = data[i]
      if (
        [
          'element',
          'button',
          'dialog',
          'radio',
          'image',
          'switch',
          'textbox',
          'alert',
          'cell',
          'menuitem',
        ].includes(item.type)
      ) {
        const elements = await this.relativeSearch(item)
        if (item.index !== false) {
          element = elements[item.index - 1]
        } else {
          if (i === 0) {
            return elements
          }
          ;[element] = elements
        }
        if ([undefined, null, ''].includes(element)) {
          throw new ReferenceError(
            `'${item.id}' has no matching elements on screen.`,
          )
        }
      } else if (item.type === 'location') {
        i -= 1
        const elements = await this.relativeSearch(data[i], item, element)
        if (data[i].index !== false) {
          element = elements[data[i].index - 1]
        } else {
          if (i === 0) {
            return elements
          }
          ;[element] = elements
        }
        if ([undefined, null, ''].includes(element)) {
          throw new ReferenceError(
            `'${data[i].id}' ${item.located} '${
              data[i + 2].id
            }' has no matching elements on screen.`,
          )
        }
      }
    }
    /* eslint-enable no-await-in-loop */

    return []
  }
}

module.exports = ElementsBase
