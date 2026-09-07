# রান্নাঘর (Rannaghor)

Android recipe app built with Expo + React Native.

## Features
- বাংলা mobile UI
- 50+ sample recipes
- Search by recipe name, English name and ingredients
- Category and country filters
- Favorites saved with AsyncStorage
- Recipe details
- Share recipe
- Cooking timer
- Dark mode
- Country-wise browsing
- Android APK build configuration

## Run
Install Node.js, then:

```bash
npm install
npx expo start
```

## Build APK with Expo EAS
Install EAS CLI:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

The `eas.json` in this project is already configured for an APK preview build.

Note: food images use remote Unsplash URLs, so the first image load requires internet access.
