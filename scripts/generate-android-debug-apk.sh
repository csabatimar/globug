#!/bin/bash
set -e

TARGET_PLATFORM='android'
ANDROID_ASSETS_DST='android/app/src/main/res'
ANDROID_OUTPUT_DIR='/tmp/fronde/mercury/globug/mobile-app/android/build/'
ANDROID_BUNDLE_OUTPUT='android/app/src/main/assets/index.android.bundle'

[[ -z "$GITHUB_WORKSPACE" ]] && ANDROID_BASE_PATH="android/" BASE_PATH="" \
|| ANDROID_BASE_PATH="${GITHUB_WORKSPACE}/android/" BASE_PATH="${GITHUB_WORKSPACE}"

cd "$BASE_PATH"
# Install dependencies
# npm ci

# Generate bundle
react-native bundle --platform ${TARGET_PLATFORM} --dev false --entry-file index.js \
--bundle-output ${ANDROID_BUNDLE_OUTPUT} --assets-dest ${ANDROID_ASSETS_DST}

cd "$ANDROID_BASE_PATH"
ENVFILE=.env ./gradlew -PversName=$VERSION_NAME app:assembleDebug

# Copy package to default location
[ ! -d "$ANDROID_OUTPUT_DIR" ] && mkdir -p "$ANDROID_OUTPUT_DIR"
cp app/build/outputs/apk/debug/app-debug.apk $ANDROID_OUTPUT_DIR
echo "file app-debug.apk copied to $ANDROID_OUTPUT_DIR"
