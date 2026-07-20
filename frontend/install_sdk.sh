#!/bin/bash
set -e
echo "10032017" | sudo -S apt-get update
echo "10032017" | sudo -S apt-get install -y unzip
mkdir -p ~/Android/cmdline-tools
cd ~/Android/cmdline-tools
wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -o -q commandlinetools-linux-*.zip
rm -rf latest
mv cmdline-tools latest
yes | ./latest/bin/sdkmanager --licenses
./latest/bin/sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0" "ndk;27.1.12297006"
echo "sdk.dir=/home/italo/Android" > /mnt/c/Users/italo/Desktop/Projects/explorae-api/frontend/android/local.properties
