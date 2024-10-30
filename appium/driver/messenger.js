const { log } = require('@nodebug/logger')

function messenger(a) {
  let message = ''
  if (
    ['isVisible', 'isDisplayed', 'isNotDisplayed', 'isEnabled'].includes(
      a.action,
    )
  ) {
    message = `Checking `
  } else if (a.action === 'click') {
    message = 'Clicking on '
  } else if (a.action === 'rightclick') {
    message = 'Right clicking on '
  } else if (a.action === 'tap') {
    message = 'Tapping on '
  } else if (a.action === 'longtap') {
    message = 'Long tapping on '
  } else if (a.action === 'write') {
    message = `Writing '${a.data}' into `
  } else if (a.action === 'toggle') {
    message = `Toggling `
  } else if (a.action === 'find') {
    message = `Searching for `
  } else if (a.action === 'findAll') {
    message = `Searching for all matches of `
  } else if (a.action === 'screenshot') {
    message = `Capturing screenshot for `
  } else if (a.action === 'value') {
    message = `Getting the value of `
  } else if (a.action === 'swipeUp') {
    message = `Swiping up on device`
  } else if (a.action === 'swipeDown') {
    message = `Swiping down on device`
  } else if (a.action === 'scrollIntoView') {
    message = `Scrolling for `
  } else if (a.action === 'clear') {
    message = `Clearing text in `
  } else if (a.action === 'drag') {
    message = `Dragging `
  } else if (a.action === 'drop') {
    message = `Dropping to `
  }

  for (let i = 0; i < a.stack.length; i++) {
    const obj = a.stack[i]
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
      ].includes(obj.type)
    ) {
      if (obj.exact) {
        message += 'exact '
      }
      message += `${obj.type} '${obj.id}' `
      if (obj.index) {
        message += `of index '${obj.index}' `
      }
    } else if (obj.type === 'location') {
      message += `located `
      if (obj.exactly === true) {
        message += `exactly `
      }
      message += `'${obj.located}' `
    } else if (obj.type === 'condition') {
      message += `'${obj.operator}' `
    }
  }
  if (a.action === 'isVisible') {
    message += `is visible`
  } else if (a.action === 'isDisplayed') {
    message += `is displayed`
  } else if (a.action === 'isNotDisplayed') {
    message += `is not displayed`
  } else if (a.action === 'isEnabled') {
    message += `is enabled`
  } else if (a.action === 'toggle') {
    message += `to ${a.data} state`
  } else if (a.action === 'scrollIntoView') {
    message += `to be visible`
  }

  log.info(message)
  return message
}

module.exports = messenger
