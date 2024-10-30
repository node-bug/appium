class macOS {
  static capabilities(server, capability) {
    const timeout = server.timeout || 10

    return {
      platformName: 'mac',
      'appium:automationName': 'mac2',
      'appium:appPath': capability.appPath,
      'appium:bundleId': capability.bundleId,
      'appium:newCommandTimeout': timeout * 30 * 1000 || 300,
    }
  }
}

module.exports = macOS
