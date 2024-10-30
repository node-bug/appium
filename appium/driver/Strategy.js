const { log } = require('@nodebug/logger')
const Device = require('../device')
const Toggle = require('./toggle')
const messenger = require('./messenger')

class Strategy {
    constructor(server, capability) {
        this.stack = []
        this.device = Device(server, capability)
        this.toggle = new Toggle(this)
        this.messenger = messenger

        this.TIMEOUT = server.timeout || 10
        this.RECOVERY_TIME = this.TIMEOUT * 40
    }

    get videoPath() {
        return this.device.videoPath
    }

    get hasActiveSession() {
        return this.device.hasActiveSession
    }

    get message() {
        return this._message
    }

    set message(value) {
        this._message = value
    }

    exactly() {
        this.stack.push({ exactly: true })
        return this
    }

    within() {
        this.stack.push({ type: 'location', located: 'within' })
        return this
    }

    relativePositioner(position) {
        const description = this.stack.pop()
        if (JSON.stringify(description) === JSON.stringify({ exactly: true })) {
            this.stack.push({ type: 'location', located: position, exactly: true })
        } else {
            if (typeof description !== 'undefined') {
                this.stack.push(description)
            }
            this.stack.push({ type: 'location', located: position, exactly: false })
        }
        return this
    }

    above() {
        return this.relativePositioner('above')
    }

    below() {
        return this.relativePositioner('below')
    }

    toLeftOf() {
        return this.relativePositioner('toLeftOf')
    }

    toRightOf() {
        return this.relativePositioner('toRightOf')
    }

    atIndex(index) {
        if (typeof index !== 'number') {
            throw new TypeError(
                `Expected parameter for atIndex is number. Received ${typeof index} instead`,
            )
        }
        const description = this.stack.pop()
        if (typeof description !== 'undefined') {
            description.index = index
            this.stack.push(description)
        }
        return this
    }

    exact() {
        this.stack.push({ exact: true })
        return this
    }

    element(data) {
        const description = this.stack.pop()
        if (JSON.stringify(description) === JSON.stringify({ exact: true })) {
            this.stack.push({
                type: 'element',
                id: data.toString(),
                exact: true,
                matches: [],
                index: false,
                visible: false,
            })
        } else {
            if (typeof description !== 'undefined') {
                this.stack.push(description)
            }
            this.stack.push({
                type: 'element',
                id: data.toString(),
                exact: false,
                matches: [],
                index: false,
                visible: false,
            })
        }
        return this
    }

    typefixer(data, type) {
        this.element(data)
        const description = this.stack.pop()
        description.type = type
        this.stack.push(description)
        return this
    }

    button(data) {
        return this.typefixer(data, 'button')
    }

    image(data) {
        return this.typefixer(data, 'image')
    }

    switch(data) {
        return this.typefixer(data, 'switch')
    }

    textbox(data) {
        return this.typefixer(data, 'textbox')
    }

    alert(data) {
        return this.typefixer(data, 'alert')
    }

    cell(data) {
        return this.typefixer(data, 'cell')
    }

    menuitem(data) {
        return this.typefixer(data, 'menuitem')
    }

    drag() {
        this.stack.push({ type: 'drag' })
        return this
    }

    /* eslint-disable class-methods-use-this, no-promise-executor-return */
    async sleep(ms) {
        log.info(`Sleeping for ${ms} milliseconds`)
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    async waitToRecover(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }
    /* eslint-enable class-methods-use-this */

    async initiate() {
        throw new Error(`Function ${this.name} "initiate" is not implemented.`)
    }

    async exit() {
        throw new Error(`Function ${this.name} "exit" is not implemented.`)
    }

    async activate(packageName) {
        return this.device.activate(packageName)
    }

    async terminate(packageName) {
        return this.device.terminate(packageName)
    }

    async uninstall(packageName) {
        return this.device.uninstall(packageName)
    }

    async clipboard() {
        return this.device.clipboard()
    }

    async source() {
        return this.device.source()
    }

    async startScreenRecording() {
        return this.device.startScreenRecording()
    }

    async stopScreenRecording() {
        return this.device.stopScreenRecording()
    }
}

module.exports = Strategy