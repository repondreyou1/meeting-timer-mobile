# Meeting Timer - Android Version

Android version of the Meeting Timer application.

## Features

- **Quick Timers**: Start 5 or 10-minute countdowns with one click
- **Custom Timer**: Set any duration in minutes
- **Meeting Alarm**: Set an alarm for 5 minutes before your meeting starts
- **Pause/Resume**: Pause and resume timers as needed
- **Visual & Audio Alerts**: Screen flashing and beep sounds when time is up
- **Large UI**: Optimized for mobile with large, easy-to-tap buttons

## Installation

1. Download `app-debug.apk` from the releases
2. Enable "Install from Unknown Sources" in your Android settings
3. Install the APK file

## Development

Built with Capacitor

```bash
npm install
npx cap sync
npx cap open android  # Open in Android Studio
```

### Build APK

```bash
cd android
./gradlew assembleDebug
```

The APK will be generated at: `android/app/build/outputs/apk/debug/app-debug.apk`

## Technologies

- **Frontend**: HTML, CSS, JavaScript
- **Framework**: Capacitor
- **Audio**: Web Audio API
- **Notifications**: Native Android notifications

## License

MIT License
