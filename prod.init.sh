cd frontend-landing-page;
yarn build-prod;
cd ..;
cd digital-twin-panel;
yarn build-prod;
cd ..;
docker-compose -f docker-compose.prod.yml up --build;