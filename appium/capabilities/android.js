class Android {
  static capabilities(server, capability) {
    return {
      platformName: capability.platformName,
      'appium:deviceName': capability.deviceName,
      'appium:platformVersion': capability.platformVersion,
      'appium:automationName': capability.automationName,
      'appium:app': capability.app,
      'appium:enforceXPath1': true,
    }
  }
}

module.exports = Android