// selector/Android.js
const SelectorsBase = require('./SelectorsBase')

const tags = {
  window: ['android.widget.FrameLayout'],
  button: ['android.widget.Button'],
  dialog: ['android.widget.AlertDialog'],
  radio: ['android.widget.RadioButton'],
  image: ['android.widget.ImageView'],
  switch: ['android.widget.Switch', 'android.view.View'],
  alert: ['androidx.appcompat.widget.LinearLayoutCompat'],
  cell: ['android.view.ViewGroup'],
  menuitem: ['android.view.MenuItem'],
  search: ['android.widget.AutoCompleteTextView'],
  textfield: ['android.widget.EditText'],
  progressbar: ['android.widget.ProgressBar'],
  tab: ['android.widget.FrameLayout'],
}

const attributes = [
  'name',
  'label',
  'value',
  'text',
  'resource-id',
  'hint',
  'content-desc',
]
class Android extends SelectorsBase {
  constructor() {
    super(attributes, tags)
  }

  getSelector(attribute, exact = false) {
    const str = this.matcher(attribute, exact)
    return {
      button: `//*[(${str}) and ${SelectorsBase.self(this.tagnames.button)}]`,
      dialog: `//*[(${str}) and ${SelectorsBase.self(this.tagnames.dialog)}]`,
      radio: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.radio,
      )}]`,
      image: `//*[(${str}) and ${SelectorsBase.self(this.tagnames.image)}]`,
      switch: `//*[(${str}) and ${SelectorsBase.self(
        this.tagnames.switch,
      )} and @resource-id='Toggle']`,
      alert: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.alert,
      )}]`,
      cell: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.cell,
      )}]`,
      menuitem: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.menuitem,
      )}]`,
      textbox: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.textbox,
      )}]`,
      progressbar: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.progressbar,
      )}]`,
      tab: `//*[(${str})]/ancestor-or-self::*[${SelectorsBase.self(
        this.tagnames.tab,
      )}]`,
      element: `//*[${str}]`,
    }
  }
}

module.exports = Android
