const SelectorsBase = require('./SelectorsBase')

const tags = {
  window: ['XCUIElementTypeWindow'],
  button: ['android.widget.Button'],
  dialog: ['android.widget.Dialog'],
  radio: ['android.widget.Radio'],
  image: ['android.widget.ImageView'],
  switch: ['android.widget.Switch'],
  alert: ['androidx.appcompat.widget.LinearLayoutCompat'],
  cell: ['android.view.ViewGroup'],
  menuitem: ['XCUIElementTypeMenuItem'],
  textfield: ['android.widget.EditText'],
  search: ['android.widget.AutoCompleteTextView'],
}

const attributes = ['name', 'label', 'value', 'text', 'resource-id']
class Android extends SelectorsBase {
  constructor() {
    super(attributes, tags)
  }

  getSelector(attribute, exact = false) {
    const str = this.matcher(attribute, exact)

    return {
      button: `//*[(${str}) and ${SelectorsBase.self(this.tagnames.button)}]`,
      dialog: `//*[(${str}) and ${SelectorsBase.self(this.tagnames.dialog)}]`,
      radio: `//*[(${str}) and ${SelectorsBase.self(this.tagnames.radio)}]`,
      image: `//*[(${str}) and ${SelectorsBase.self(this.tagnames.image)}]`,
      switch: `//*[(${str}) and ${SelectorsBase.self(this.tagnames.switch)}]`,
      textbox: `//*[(${str}) and ${SelectorsBase.self(this.tagnames.textbox)}]`,
      alert: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.alert,
      )}]`,
      cell: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.cell,
      )}]`,
      menuitem: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.menuitem,
      )}]`,
      element: `//*[${str}]`,
    }
  }
}

module.exports = Android
