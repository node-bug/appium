class iOS {
  static capabilities(server, capability) {
    const deviceName = capability.deviceName || 'iPhone 12'
    const platformVersion = capability.platformVersion || '17.5'
    const app = capability.app || ''
    const usePreinstalledWDA = server.usePreinstalledWDA || false
    const timeout = server.timeout || 10
    const headless = server.headless || false

    return {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': deviceName,
      'appium:platformVersion': platformVersion,
      'appium:app': app,
      'appium:usePreinstalledWDA': usePreinstalledWDA,
      'appium:isHeadless': headless,
      'appium:newCommandTimeout': timeout * 60 || 600,
      'appium:wdaLaunchTimeout': timeout * 12 * 1000 || 120000,
      'appium:wdaConnectionTimeout': timeout * 30 * 1000 || 300000,
      'appium:simulatorStartupTimeout': timeout * 30 * 1000 || 300000,
      'appium:waitForIdleTimeout': timeout * 3 || 30,
      'appium:clearSystemFiles': true,
      'appium:autoLaunch': false,
      'appium:includeSafariInWebviews': true,
      'appium:skipLogCapture': true,
      'appium:disableAutomaticScreenshots': true,
      'appium:autoFillPasswords': false,
      'appium:maxTypingFrequency': 10,
    }
  }
}

module.exports = iOS
