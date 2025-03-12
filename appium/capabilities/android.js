// capabilities/android.js

class Android {
  static capabilities(server, capability) {
    const deviceName = capability.deviceName || 'pixel_6'
    const platformVersion = capability.platformVersion || '12.0'
    const app = capability.app || ''

    return {
      platformName: 'Android',
      'appium:deviceName': deviceName,
      'appium:platformVersion': platformVersion,
      'appium:automationName': 'UiAutomator2',
      'appium:app': app,
      'appium:enforceXPath1': true,
    }
  }
}

module.exports = Android
