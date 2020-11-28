cd twitch_crawler_ui
flutter pub get
flutter build web
cd ..
rm -r src/public/*
# cp -R /home/nslab/Desktop/controller/ui/build/web/* /home/nslab/Desktop/controller/src/public
cp -R twitch_crawler_ui/build/web/* src/public

