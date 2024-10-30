const { log } = require('@nodebug/logger')

class ToggleBase {
  constructor(that) {
    this.that = that
  }

  async performer() {
    throw new Error(
      `Function ${this.name} "performer(elementId)" is not implemented.`,
    )
  }

  async action(state) {
    this.that.message = this.that.messenger({
      stack: this.that.stack,
      action: 'toggle',
      data: state,
    })

    try {
      const locator = await this.that.finder(null, 'toggle')
      const currentState = await this.that.device.actions.getAttribute(
        locator.ELEMENT,
        'value',
      )
      if (
        (state === 'ON' && currentState === '0') ||
        (state === 'OFF' && currentState === '1')
      ) {
        await this.performer(locator.ELEMENT)
        await this.that.waitToRecover(this.that.RECOVERY_TIME)

        let newState
        try {
          const newLocator = await this.that.finder(null, 'toggle')
          newState = await this.that.device.actions.getAttribute(
            newLocator.ELEMENT,
            'value',
          )
        } catch (err) {
          log.warn(`${this.that.message}\n${err.message}`)
          log.info(
            `Retrying to get value of toggle using ElementId before toggle was pressed on.`,
          )
          newState = await this.that.device.actions.getAttribute(
            locator.ELEMENT,
            'value',
          )
        }

        if (
          (state === 'ON' && newState === '0') ||
          (state === 'OFF' && newState === '1')
        ) {
          throw new Error(`Setting toggle to ${state} was not successfull.`)
        }
        log.info(`Toggle set to ${state} state`)
      } else {
        log.info(`Toggle is already in ${state} state.`)
      }
    } catch (err) {
      log.error(
        `${this.that.message}\nError while toggling element to ${state} state.\nError ${err.stack}`,
      )
      this.that.stack = []
      err.message = `Error while ${this.that.message}\n${err.message}`
      throw err
    }
    this.that.stack = []
    return true
  }

  async validate(expectedState) {
    let currentState
    this.that.message = this.that.messenger({
      stack: this.that.stack,
      action: 'value',
    })
    try {
      const locator = await this.that.finder(null, 'toggle')
      currentState = await this.that.device.actions.getAttribute(
        locator.ELEMENT,
        'value',
      )
    } catch (err) {
      log.error(
        `${this.that.message}\nError while checking toggle is in ${expectedState} state.\nError ${err.stack}`,
      )
      this.that.stack = []
      err.message = `Error while ${this.that.message}\n${err.message}`
      throw err
    }

    if (
      (expectedState === 'ON' && currentState === '1') ||
      (expectedState === 'OFF' && currentState === '0')
    ) {
      log.info(`Toggle is in ${expectedState} state`)
    } else {
      log.error(
        `${this.that.message}\nToggle is not in ${expectedState} state and current state is ${currentState}`,
      )
      this.that.stack = []
      throw new Error(`Error while ${this.that.message}`)
    }

    this.that.stack = []
    return true
  }

  async on() {
    return this.action('ON')
  }

  async off() {
    return this.action('OFF')
  }

  async isOn() {
    return this.validate('ON')
  }

  async isOff() {
    return this.validate('OFF')
  }
}

module.exports = ToggleBase
