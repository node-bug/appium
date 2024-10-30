class SelectorsBase {
  constructor(attributes, tags) {
    this.attributes = attributes
    this.tags = tags
  }

  get tagnames() {
    return {
      window: this.tags.window,
      button: this.tags.button,
      dialog: this.tags.dialog,
      radio: this.tags.radio,
      image: this.tags.image,
      switch: this.tags.switch,
      alert: this.tags.alert,
      cell: this.tags.cell,
      menuitem: this.tags.menuitem,
      search: this.tags.search,
      textfield: this.tags.textfield,
      textbox: [].concat.apply([], [this.tags.textfield, this.tags.search]),
    }
  }

  static self(tags) {
    return `(${tags.map((tagname) => `self::${tagname}`).join(' or ')})`
  }

  get transformed() {
    if (this.value.includes("'")) {
      return `concat('${this.value.replace(`'`, `',"'",'`)}')`
    }
    return `'${this.value}'`
  }

  get exactMatcher() {
    let string = ''
    this.attributes.forEach((attribute) => {
      string += `normalize-space(@${attribute})=${this.transformed} or `
    })
    string += `normalize-space(.)=${this.transformed} `
    string += `and not(.//*[normalize-space(.)=${this.transformed}])`
    return string
  }

  get partialMatcher() {
    let string = ''
    this.attributes.forEach((attribute) => {
      string += `contains(normalize-space(@${attribute}),${this.transformed}) or `
    })
    string += `contains(normalize-space(.),${this.transformed}) `
    string += `and not(.//*[contains(normalize-space(.),${this.transformed})])`
    return string
  }

  get value() {
    return this._value
  }

  set value(data) {
    this._value = data
  }

  matcher(attribute, exact = false) {
    this.value = attribute

    if (exact) {
      return this.exactMatcher
    }
    return this.partialMatcher
  }
}

module.exports = SelectorsBase
