const ActionsBase = require('./ActionsBase')

class macOS extends ActionsBase {
    async toggle(locator) {
        await this.driver.executeScript('macos: click', [
            {
                x: locator.rect.midx,
                y: locator.rect.midy,
            },
        ])
    }
}

module.exports = macOS