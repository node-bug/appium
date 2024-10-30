const SelectorsBase = require('./SelectorsBase')

const tags = {
  window: ['XCUIElementTypeWindow'],
  button: ['XCUIElementTypeButton'],
  image: ['XCUIElementTypeImage'],
  switch: ['XCUIElementTypeSwitch'],
  alert: ['XCUIElementTypeAlert', 'XCUIElementTypeSheet'],
  cell: ['XCUIElementTypeCell'],
  radio: ['XCUIElementTypeRadioButton'],
  menuitem: ['XCUIElementTypeMenuItem'],
  textfield: ['XCUIElementTypeTextField', 'XCUIElementTypeSecureTextField'],
  search: ['XCUIElementTypeSearchField', 'XCUIElementTypeTextView'],
}

const attributes = [
  'name',
  'label',
  'value',
  'text',
  'identifier',
  'placeholderValue',
  'title',
]

class macOS extends SelectorsBase {
  constructor() {
    super(attributes, tags)
  }

  getSelector(attribute, exact = false) {
    const str = this.matcher(attribute, exact)

    return {
      button: `//XCUIElementTypeWindow//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.button,
      )}]`,
      radio: `//XCUIElementTypeWindow//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.radio,
      )}]`,
      image: `//XCUIElementTypeWindow//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.image,
      )}]`,
      switch: `//XCUIElementTypeWindow//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.switch,
      )}]`,
      textbox: `//XCUIElementTypeWindow//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.textbox,
      )}]`,
      alert: `//XCUIElementTypeWindow//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.alert,
      )}]`,
      cell: `//XCUIElementTypeWindow//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.cell,
      )} or (self::*[contains(@name, 'Cell-')]) or (self::*[contains(@identifier, 'Cell-')])]`,
      menuitem: `//XCUIElementTypeWindow//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.menuitem,
      )}]`,
      element: `//XCUIElementTypeWindow//*[${str}]`,
    }
  }
}

module.exports = macOS
