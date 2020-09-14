#!/bin/sh

echo "ApecSoft Mobile Team 2020 - Initialization project React Native - Version 1.0.0"
read -p 'Project name: ' project_name
if [ -z "$project_name" ]; then
    echo 'Inputs cannot the blank please try again!'
    exit 0
fi
read -p 'Version: ' version
npm list -g | grep react-native-cli || npm install -g react-native-cli
echo "Init your project:"
if [ -z "$version" ]; then
react-native init $project_name
else
react-native init $project_name --version $version
fi
cd "./$project_name"
curl -o "./$project_name.zip" "http://103.48.83.137/rn_core/src.zip" --progress-bar
unzip "./$project_name.zip"
rm -rf "./$project_name.zip"
npm i axios mobx mobx-react react-native-i18n react-native-responsive-screen @react-native-community/async-storage  --save
npm i @babel/plugin-proposal-decorators babel-plugin-module-resolver --save-dev
mv src/jsconfig.json ./
mv src/babel.config.js ./
mv src/build_apk.sh ./
mv src/clean_android.sh ./
mv src/clean_android.sh ./