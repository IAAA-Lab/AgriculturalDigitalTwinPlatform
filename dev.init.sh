cd frontend-landing-page;
yarn build;
cd ..;
cd digital-twin-panel;
yarn build;
cd ..;
docker-compose -f docker-compose.dev.yml up --build;