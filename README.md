[Antivirus Scan Files](https://www.eicar.org/download-anti-malware-testfile/)

# Config

Examples of configuration in .config folder

## device.json

Device config sample files for ./.config/device.json:

### Android

```json
{
  "platformName": "Android",
  "platformVersion": "12.0",
  "deviceName": "Nexus 5",
  "automationName": "UIAutomator2",
  "app": "/Users/thomasdsilva/Downloads/xyz-v1-staging.apk"
}
```

### iOS

```json
{
  "platformName": "iOS",
  "platformVersion": "14.5",
  "deviceName": "iPhone 12",
  "automationName": "XCUITest",
  "app": "/Users/thomasdsilva/Library/Developer/Xcode/DerivedData/Build/Products/Test-iphonesimulator/xyz.app"
}
```

AVD Sample of an AVD created on MAC:
Name: Nexus_6P_12.0_21823
Device: Nexus 6P (Google)
Path: /Users/thomasdsilva/.android/avd/Nexus_6P_12.0_21823.avd
Target: Google APIs (Google Inc.)
Based on: Android 12.0 (S) Tag/ABI: google_apis/arm64-v8a
Sdcard: 512 MB

# VSCode

## Debugging

### launch.json

Sample launch.json file for easily starting to debug the code on any device or configuration

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "NPM Cukes",
      "type": "node",
      "request": "launch",
      "console": "integratedTerminal",
      "program": "${workspaceRoot}/node_modules/@cucumber/cucumber/bin/cucumber-js",
      "args": [
        "--publish-quiet",
        "-f",
        "json:reports/cucumber_report.json",
        "./features/",
        "--tags",
        "@test"
        // "@LoginCard",
        // "--fail-fast",
        // "--parallel", "5",
        // "--retry", "2"
        // "--dry-run",
      ],
      "env": {
        "app": "/Users/thomasdsilva/Downloads/xyz.app",
        "env": "test",
        "screenshots": "onfail",
        "video": "true",
        "NODE_ENV": "local"
        // "deviceName": "iPad Air 2",
      }
    }
  ]
}
```

# Device Farm

## Setup

### Appium

```
- npm install -g appium
```

### iOS Drivers

```
- appium driver install xcuitest
```

### Plugins

```
- npm cache clean --force
- appium plugin install --source=npm appium-device-farm
- appium plugin install --source=npm appium-dashboard
- appium plugin run device-farm install-go-ios
- npm install -g go-ios
- export GO_IOS="export GO_IOS="/usr/local/lib/node_modules/go-ios/dist/go-ios-darwin-amd64_darwin_amd64/ios"
```

## Delete All iOS Devices

```
- xcrun simctl delete all
```

## Start Appium Server

```
- appium server --use-plugins=device-farm --plugin-device-farm-platform=ios --log-level error
```

without device farm

```
- appium --port 4724 --log-level error --relaxed-security
npm i -g mjpeg-consumer
sudo chown -R 501:20 "/$path$/.npm".
```

## New iOS Device

```
- xcrun simctl create "iPhone 12" com.apple.CoreSimulator.SimDeviceType.iPhone-12 com.apple.CoreSimulator.SimRuntime.iOS-17-2
```

## Build Appium WDA

```
- appium driver run xcuitest build-wda
```

Appium WDA Path: /Users/<username>/.appium/node_modules/appium-xcuitest-driver/node_modules/appium-webdriveragent

## Devices List

- [Localhost](http://localhost:4723/device-farm/)
- [MacMini](http://10.11.10.105:4723/device-farm/)
- Custom Appium IP: http://<IP>:<PORT>/device-farm/

## Device Sessions Dashboard

- [Localhost](http://localhost:4723/dashboard/)
- [MacMini](http://10.11.10.105:4723/dashboard/)
- Custom Appium IP: http://<IP>:<PORT>/dashboard/

# Remove hidden files from repo

```
find . -name .DS_Store -print0 | xargs -0 git rm -f --ignore-unmatch
```

```
git init
```
