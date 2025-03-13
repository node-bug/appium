// toogle/Android.js

const { log } = require('@nodebug/logger')
const ToggleBase = require('./ToggleBase')

class Android extends ToggleBase {
  async performer(elementId) {
    await this.that.device.actions.tap(elementId)
    log.info('Tapped on toggle.')
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
        'checked',
      )
      if (
        (state === 'ON' && currentState === 'false') ||
        (state === 'OFF' && currentState === 'true')
      ) {
        await this.performer(locator.ELEMENT)
        await this.that.waitToRecover(this.that.RECOVERY_TIME)

        let newState
        try {
          const newLocator = await this.that.finder(null, 'toggle')
          newState = await this.that.device.actions.getAttribute(
            newLocator.ELEMENT,
            'checked',
          )
        } catch (err) {
          log.warn(`${this.that.message}\n${err.message}`)
          log.info(
            `Retrying to get value of toggle using ElementId before toggle was pressed on.`,
          )
          newState = await this.that.device.actions.getAttribute(
            locator.ELEMENT,
            'checked',
          )
        }

        if (
          (state === 'ON' && newState === 'false') ||
          (state === 'OFF' && newState === 'true')
        ) {
          throw new Error(`Setting toggle to ${state} was not successful.`)
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
}

module.exports = Android
