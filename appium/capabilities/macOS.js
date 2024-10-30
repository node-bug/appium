class macOS {
    static capabilities(server, capability) {
        return {
            platformName: 'mac',
            'appium:automationName': 'mac2',
            'appium:appPath': capability.appPath,
            'appium:bundleId': capability.bundleId,
        }
    }
}

module.exports = macOS