const { log } = require('@nodebug/logger')
const Strategy = require('./Strategy')

class iOS extends Strategy {
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

  async screenshot() {
    let dataUrl = false
    if (this.stack.length > 0) {
      let locator
      try {
        locator = await this.finder()
      } catch (err) {
        log.error(err.stack)
      }
      if (![undefined, null, ''].includes(locator)) {
        this.messenger({ stack: this.stack, action: 'screenshot' })
        dataUrl = await this.device.actions.elementScreenshot(locator.ELEMENT)
      }
    }

    if (!dataUrl) {
      log.info('Capturing screenshot of device')
      dataUrl = await this.device.actions.screenshot()
    }

    this.stack = []
    return dataUrl
  }

  async longtap() {
    this.message = this.messenger({ stack: this.stack, action: 'longtap' })
    this.stack[0].visible = true
    try {
      const locator = await this.finder()
      await this.device.actions.longtap(locator.ELEMENT)
      await this.waitToRecover(this.RECOVERY_TIME)
    } catch (err) {
      log.error(
        `${this.message}\nError while tapping on element.\nError ${err.stack}`,
      )
      this.stack = []
      err.message = `Error while ${this.message}\n${err.message}`
      throw err
    }
    this.stack = []
    return true
  }

  async drop() {
    const a = [...this.stack]
    const b = a.findIndex((e) => e.type === 'drag')

    const c = [...a].splice(0, b)
    const d = [...a][b + 1]
    const e = [...a].splice(b + 1, a.length)
    const f = [...a].splice(b + 2, a.length)

    this.message = this.messenger({ stack: c, action: 'drag' })
    this.message = `${this.message} and ${this.messenger({ stack: e, action: 'drop' })}`

    try {
      this.stack = [...c]
      const g = await this.finder()
      this.stack = [...f]
      const h = await this.finder()

      let i = {}
      switch (d) {
        case 'toLeftOf':
          i = { toX: h.rect.left }
          break

        case 'toRightOf':
          i = { toX: h.rect.right }
          break

        case 'above':
          i = { toY: h.rect.top }
          break

        case 'below':
          i = { toY: h.rect.bottom }
          break

        default:
          break
      }

      const { fromX, fromY, toX, toY } = {
        fromX: g.rect.midx,
        fromY: g.rect.midy,
        toX: h.rect.left,
        toY: h.rect.midy,
        ...i,
      }
      await this.device.actions.dragAndDrop(fromX, fromY, toX, toY)
      await this.waitToRecover(this.RECOVERY_TIME)
    } catch (err) {
      log.error(
        `${this.message}\nError during drag and drop.\nError ${err.stack}`,
      )
      this.stack = []
      err.message = `Error while ${this.message}\n${err.message}`
      throw err
    }

    this.stack = []
    return true
  }

  async tap() {
    this.message = this.messenger({ stack: this.stack, action: 'tap' })
    this.stack[0].visible = true
    try {
      const locator = await this.finder()
      await this.device.actions.tap(locator.ELEMENT)
      await this.waitToRecover(this.RECOVERY_TIME)
    } catch (err) {
      log.error(
        `${this.message}\nError while tapping on element.\nError ${err.stack}`,
      )
      err.message = `Error while ${this.message}\n${err.message}`
      this.stack = []
      throw err
    }
    this.stack = []
    return true
  }

  async clear() {
    this.message = this.messenger({ stack: this.stack, action: 'clear' })
    this.stack[0].visible = true
    try {
      const locator = await this.finder(null, 'write')
      await this.device.actions.clear(locator.ELEMENT)
      await this.waitToRecover(this.RECOVERY_TIME)
    } catch (err) {
      log.error(`${this.message}\nError clearing data.\nError ${err.stack}`)
      this.stack = []
      err.message = `Error while ${this.message}\n${err.message}`
      throw err
    }
    this.stack = []
    return true
  }

  async write(data) {
    this.message = this.messenger({
      stack: this.stack,
      action: 'write',
      data,
    })
    this.stack[0].visible = true
    try {
      const locator = await this.finder(null, 'write')
      await this.device.actions.write(locator.ELEMENT, data)
      await this.waitToRecover(this.RECOVERY_TIME)
    } catch (err) {
      log.error(
        `${this.message}\nError while entering data.\nError ${err.stack}`,
      )
      this.stack = []
      err.message = `Error while ${this.message}\n${err.message}`
      throw err
    }
    this.stack = []
    return true
  }

  async isNotDisplayed(t = null) {
    await this.sleep(1000)
    this.message = this.messenger({
      stack: this.stack,
      action: 'isNotDisplayed',
    })
    let timeout
    if (t === null) {
      timeout = this.timeout * 1000
    } else {
      timeout = t
    }

    const now = await Date.now()
    /* eslint-disable no-await-in-loop */
    while (Date.now() < now + timeout) {
      try {
        let locators = await this.device.elements.findAll(this.stack)
        if (locators.length === 0) {
          throw new Error('0 matching elements found')
        } else {
          locators = await Promise.all(
            locators.map(async (locator) =>
              this.device.actions.getAttribute(locator.ELEMENT, 'visible'),
            ),
          )
          if (!locators.includes('true')) {
            throw new Error('0 matching elements found')
          }
        }
      } catch (err) {
        log.info('Element is not visible on screen')
        this.stack = []
        return true
      }
    }
    /* eslint-enable no-await-in-loop */
    log.error(`${this.message}\nElement is visible on screen`)
    this.stack = []
    throw new Error(`Error while ${this.message}\nElement is visible on screen`)
  }

  async isDisplayed(t = null) {
    this.message = this.messenger({ stack: this.stack, action: 'isDisplayed' })
    try {
      await this.finder(t)
    } catch (err) {
      log.error(
        `${this.message}\nElement is not visible on screen\n${err.message}`,
      )
      this.stack = []
      err.message = `Error while ${this.message}\n${err.message}`
      throw err
    }
    log.info('Element is visible on screen')
    this.stack = []
    return true
  }

  async isVisible(t = null) {
    this.message = this.messenger({ stack: this.stack, action: 'isVisible' })
    let e
    try {
      e = await this.finder(t)
    } catch (err) {
      log.info(err.message)
    }

    this.stack = []
    if (![null, undefined, ''].includes(e)) {
      log.info('Element is visible on screen')
      return true
    }
    log.info('Element is not visible on screen')
    return false
  }

  async isEnabled() {
    this.message = this.messenger({ stack: this.stack, action: 'isEnabled' })
    try {
      const locator = await this.finder()
      const v = JSON.parse(
        await this.device.actions.getAttribute(locator.ELEMENT, 'enabled'),
      )
      if (v) {
        log.info('Element is enabled')
      } else {
        log.info('Element is disabled')
      }
      this.stack = []
      return v
    } catch (err) {
      log.error(`Error while ${this.message}\nError ${err.stack}`)
      this.stack = []
      err.message = `Error while ${this.message}\n${err.message}`
      throw err
    }
  }

  async value() {
    this.message = this.messenger({ stack: this.stack, action: 'value' })
    try {
      const locator = await this.finder()
      const v = await this.device.actions.getAttribute(locator.ELEMENT, 'value')
      log.info(`Value is ${v}`)
      this.stack = []
      return v
    } catch (err) {
      log.error(`Error while ${this.message}\nError ${err.stack}`)
      this.stack = []
      err.message = `Error while ${this.message}\n${err.message}`
      throw err
    }
  }

  async finder(t = null, action = null) {
    let timeout
    if (t === null) {
      timeout = this.timeout * 1000
    } else {
      timeout = t
    }

    const now = await Date.now()
    let locator
    while (Date.now() < now + timeout && locator === undefined) {
      try {
        // eslint-disable-next-line no-await-in-loop
        locator = await this.device.elements.find(this.stack, action)
      } catch (err) {
        // eslint-disable-next-line no-empty
        if (!err.message.includes('has no matching elements on screen')) {
          log.warn(err.stack)
        }
      }
    }

    if (locator === undefined) {
      throw new Error(
        `Element was not found on screen after ${timeout} timeout`,
      )
    }
    return locator
  }

  async findAll() {
    this.message = this.messenger({ stack: this.stack, action: 'findAll' })
    let locators = []
    try {
      try {
        await this.finder()
      } catch (err) {
        log.info('No matching elements are visible on screen.')
      }
      locators = await this.device.elements.findAll(this.stack)
    } catch (err) {
      log.error(
        `${this.message}\nError while finding all matching elements.\n${err.message}`,
      )
      this.stack = []
      err.message = `Error while ${this.message}\n${err.message}`
      throw err
    }
    this.stack = []
    return locators
  }

  async find() {
    this.message = this.messenger({ stack: this.stack, action: 'find' })
    let locator
    try {
      locator = await this.finder()
    } catch (err) {
      log.info(err.message)
    }

    this.stack = []
    if (![null, undefined, ''].includes(locator)) {
      log.info('Element is visible on screen')
      return locator
    }
    log.info('Element is not visible on screen')
    throw new Error(
      `Error while ${this.message}\nElement is not visible on screen`,
    )
  }

  async swipeUp() {
    this.message = this.messenger({ stack: this.stack, action: 'swipeUp' })
    let e = await this.device.driver.findElement(
      'xpath',
      '//XCUIElementTypeWindow',
    )
    e = await this.device.elements.addQualifiers(e)
    const { fromX, fromY, toX, toY } = {
      fromX: e.rect.x + e.rect.width * 0.25,
      fromY: e.rect.y + e.rect.height * 0.3,
      toX: e.rect.x + e.rect.width * -0.25,
      toY: e.rect.y + e.rect.height * -0.7,
    }
    await this.device.actions.swipe(fromX, fromY, toX, toY)
    await this.waitToRecover(this.RECOVERY_TIME)
    return true
  }

  async swipeDown() {
    this.message = this.messenger({ stack: this.stack, action: 'swipeDown' })
    let e = await this.device.driver.findElement(
      'xpath',
      '//XCUIElementTypeWindow',
    )
    e = await this.device.elements.addQualifiers(e)
    const { fromX, fromY, toX, toY } = {
      fromX: e.rect.x + e.rect.width * -0.5,
      fromY: e.rect.y + e.rect.height * 0.3,
      toX: e.rect.x + e.rect.width * -0.5,
      toY: e.rect.y + e.rect.height * 0.7,
    }
    await this.device.actions.swipe(fromX, fromY, toX, toY)
    await this.waitToRecover(this.RECOVERY_TIME)
    return true
  }

  async scrollIntoView() {
    this.message = this.messenger({
      stack: this.stack,
      action: 'scrollIntoView',
    })
    try {
      const locator = await this.finder()
      await this.device.actions.scrollTo(locator.ELEMENT)
      await this.waitToRecover(this.RECOVERY_TIME)
      await this.scrollAndBringToCenter()
    } catch (err) {
      log.warn(
        `${this.message}\nError while scrolling to element\n${err.message}`,
      )
      log.info('Now trying other scroll...')
      await this.otherScroll()
    } finally {
      this.stack = []
    }
    log.info('Scrolled element into view.')
    return true
  }

  async scrollAndBringToCenter() {
    try {
      const locator = await this.finder()
      let e = await this.device.driver.findElement(
        'xpath',
        '//XCUIElementTypeWindow',
      )
      if (e.error === 'no such element') {
        log.info('Window is not accessible.')
        return false
      }
      e = await this.device.elements.addQualifiers(e)
      if (locator.rect.bottom > 0.8 * e.rect.bottom) {
        const { fromX, fromY, toX, toY } = {
          fromX: e.rect.midx,
          fromY: e.rect.midy,
          toX: e.rect.midx,
          toY: e.rect.midy - 100,
        }
        await this.device.actions.swipe(fromX, fromY, toX, toY)
      } else if (locator.rect.bottom < 0.3 * e.rect.bottom) {
        const { fromX, fromY, toX, toY } = {
          fromX: e.rect.midx,
          fromY: e.rect.midy,
          toX: e.rect.midx,
          toY: e.rect.midy + 100,
        }
        await this.device.actions.swipe(fromX, fromY, toX, toY)
      }
      await this.waitToRecover(this.RECOVERY_TIME)
    } catch (err) {
      log.err(`${err.message}\n${err.stack}`)
      throw err
    }
    return true
  }

  async otherScroll() {
    try {
      let e = await this.device.driver.findElement(
        'xpath',
        `//*[contains(@name, 'Vertical scroll bar')]/..`,
      )
      if (e.error === 'no such element') {
        log.info(
          'Screen is not scrollable as scroll bar is missing. Could not scroll to element.',
        )
        return false
      }
      e = await this.device.elements.addQualifiers(e)

      /* eslint-disable no-await-in-loop */
      do {
        try {
          const locators = await this.device.elements.findAll(this.stack)
          if (locators.length > 0) {
            await this.device.actions.scrollTo(locators[0].ELEMENT)
            await this.waitToRecover(this.RECOVERY_TIME)
            log.info('Successfully scrolled offscreen element into view')
            break
          }
        } catch (err) {
          log.error(`Error while searching for elements. Err:${err.message}`)
        }
        log.info('Element is not visible on screen. Scrolling...')
        const press = await this.device.actions.source()
        const { fromX, fromY, toX, toY } = {
          fromX: e.rect.midx,
          fromY: e.rect.midy,
          toX: e.rect.x,
          toY: e.rect.y,
        }
        await this.device.actions.swipe(fromX, fromY, toX, toY)
        await this.waitToRecover(this.RECOVERY_TIME)

        let count = 0
        do {
          const j1 = await this.device.actions.source()
          const j2 = await this.device.actions.source()
          if (JSON.stringify(j1) === JSON.stringify(j2)) {
            break
          }
          count += 1
        } while (count < 10)
        const postss = await this.device.actions.source()
        if (JSON.stringify(press) === JSON.stringify(postss)) {
          throw new Error('End of screen reached. Unable to scroll.')
        }
        // eslint-disable-next-line no-constant-condition
      } while (true)
      /* eslint-enable no-await-in-loop */
    } catch (err) {
      err.message = `${this.message}\nError while scrolling to offscreen element.\n${err.message}.\nAlso, no matching elements were found offscreen.`
      log.error(err.message)
      this.stack = []
      throw err
    }

    return true
  }
}

module.exports = iOS
