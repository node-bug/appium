const SelectorsBase = require('./SelectorsBase')

const tags = {
  window: ['XCUIElementTypeWindow'],
  button: ['XCUIElementTypeButton'],
  dialog: ['XCUIElementTypeDialog'],
  radio: ['XCUIElementTypeRadioButton'],
  image: ['XCUIElementTypeImage'],
  switch: ['XCUIElementTypeSwitch'],
  alert: ['XCUIElementTypeAlert'],
  cell: ['XCUIElementTypeCell'],
  menuitem: ['XCUIElementTypeMenuItem'],
  textfield: ['XCUIElementTypeTextField', 'XCUIElementTypeSecureTextField'],
  search: ['XCUIElementTypeSearchField', 'XCUIElementTypeTextView'],
}

const attributes = ['name', 'label', 'value', 'text']

class iOS extends SelectorsBase {
  constructor() {
    super(attributes, tags)
  }

  getSelector(attribute, exact = false) {
    const str = this.matcher(attribute, exact)

    return {
      button: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.button,
      )}]`,
      dialog: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.dialog,
      )}]`,
      radio: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.radio,
      )}]`,
      image: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.image,
      )}]`,
      switch: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.switch,
      )}]`,
      alert: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.alert,
      )}]`,
      cell: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.cell,
      )} or (self::*[contains(@name, 'Cell-')])]`,
      menuitem: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.menuitem,
      )}]`,
      textbox: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.textbox,
      )}]`,
      element: `//XCUIElementTypeWindow/XCUIElementTypeOther[@visible='true']//*[${str}]`,
    }
  }
}

module.exports = iOS
