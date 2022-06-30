cd frontend-landing-page;
yarn build-dev;
cd ..;
cd digital-twin-panel;
yarn build-dev;
cd ..;
docker-compose -f docker-compose.dev.yml up --build;

# On MacOS: launchctl load /usr/local/cellar/nginx/1.23.0/homebrew.mxcl.nginx.plist