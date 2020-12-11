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
curl -o "./$project_name.zip" "https://github.com/Dat0318/RN_Core/src_custom_full.zip" --progress-bar
unzip "./src_custom_full.zip"
mv src_custom_full src
rm -rf "./src_custom_full.zip"
rm -rf "./App.js"
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view --save
npm i axios mobx mobx-react react-native-i18n react-native-responsive-screen @react-native-community/async-storage --save
npm i @react-navigation/material-top-tabs @react-native-firebase/app @react-native-firebase/messaging @react-native-community/datetimepicker --save
npm i @react-navigation/native @react-navigation/stack lodash react-native-actions-sheet react-native-tab-view --save
npm i react-native-image-picker react-native-keyboard-aware-scroll-view react-native-simple-toast react-native-skeleton-placeholder --save

npm i @babel/plugin-proposal-decorators babel-plugin-module-resolver --save-dev

mv src/App.js ./
mv src/init.sh ./
mv src/build_apk.sh ./
mv src/jsconfig.json ./
mv src/clean_android.sh ./
mv src/babel.config.js ./

# init for git
git init
git add *
git commit -m "source base"

echo "finish create app !!!"