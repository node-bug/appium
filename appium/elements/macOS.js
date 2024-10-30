const ElementsBase = require('./ElementsBase')
const Selectors = require('../selectors')

const XCUIElementType = [
  'XCUIElementTypeAny',
  'XCUIElementTypeOther',
  'XCUIElementTypeApplication',
  'XCUIElementTypeGroup',
  'XCUIElementTypeWindow',
  'XCUIElementTypeSheet',
  'XCUIElementTypeDrawer',
  'XCUIElementTypeAlert',
  'XCUIElementTypeDialog',
  'XCUIElementTypeButton',
  'XCUIElementTypeRadioButton',
  'XCUIElementTypeRadioGroup',
  'XCUIElementTypeCheckBox',
  'XCUIElementTypeDisclosureTriangle',
  'XCUIElementTypePopUpButton',
  'XCUIElementTypeComboBox',
  'XCUIElementTypeMenuButton',
  'XCUIElementTypeToolbarButton',
  'XCUIElementTypePopover',
  'XCUIElementTypeKeyboard',
  'XCUIElementTypeKey',
  'XCUIElementTypeNavigationBar',
  'XCUIElementTypeTabBar',
  'XCUIElementTypeTabGroup',
  'XCUIElementTypeToolbar',
  'XCUIElementTypeStatusBar',
  'XCUIElementTypeTable',
  'XCUIElementTypeTableRow',
  'XCUIElementTypeTableColumn',
  'XCUIElementTypeOutline',
  'XCUIElementTypeOutlineRow',
  'XCUIElementTypeBrowser',
  'XCUIElementTypeCollectionView',
  'XCUIElementTypeSlider',
  'XCUIElementTypePageIndicator',
  'XCUIElementTypeProgressIndicator',
  'XCUIElementTypeActivityIndicator',
  'XCUIElementTypeSegmentedControl',
  'XCUIElementTypePicker',
  'XCUIElementTypePickerWheel',
  'XCUIElementTypeSwitch',
  'XCUIElementTypeToggle',
  'XCUIElementTypeLink',
  'XCUIElementTypeImage',
  'XCUIElementTypeIcon',
  'XCUIElementTypeSearchField',
  'XCUIElementTypeScrollView',
  'XCUIElementTypeScrollBar',
  'XCUIElementTypeStaticText',
  'XCUIElementTypeTextField',
  'XCUIElementTypeSecureTextField',
  'XCUIElementTypeDatePicker',
  'XCUIElementTypeTextView',
  'XCUIElementTypeMenu',
  'XCUIElementTypeMenuItem',
  'XCUIElementTypeMenuBar',
  'XCUIElementTypeMenuBarItem',
  'XCUIElementTypeMap',
  'XCUIElementTypeWebView',
  'XCUIElementTypeIncrementArrow',
  'XCUIElementTypeDecrementArrow',
  'XCUIElementTypeTimeline',
  'XCUIElementTypeRatingIndicator',
  'XCUIElementTypeValueIndicator',
  'XCUIElementTypeSplitGroup',
  'XCUIElementTypeSplitter',
  'XCUIElementTypeRelevanceIndicator',
  'XCUIElementTypeColorWell',
  'XCUIElementTypeHelpTag',
  'XCUIElementTypeMatte',
  'XCUIElementTypeDockItem',
  'XCUIElementTypeRuler',
  'XCUIElementTypeRulerMarker',
  'XCUIElementTypeGrid',
  'XCUIElementTypeLevelIndicator',
  'XCUIElementTypeCell',
  'XCUIElementTypeLayoutArea',
  'XCUIElementTypeLayoutItem',
  'XCUIElementTypeHandle',
  'XCUIElementTypeStepper',
  'XCUIElementTypeTab',
  'XCUIElementTypeTouchBar',
  'XCUIElementTypeStatusItem',
]

class macOS extends ElementsBase {
  constructor(driver) {
    const selectors = Selectors('macos')
    super(driver, selectors)
  }

  async getElementTagName(elementId) {
    const elementType = await this.driver.getElementAttribute(
      elementId,
      'elementType',
    )
    return XCUIElementType[elementType]
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
    element.tagname = await this.getElementTagName(element.ELEMENT)
    element.visible = true
    return element
  }
}

module.exports = macOS
