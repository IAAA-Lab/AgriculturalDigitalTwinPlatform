# deploy backend to heroku
cd backend && git push heroku master ; heroku restart --app quiet-wave-60794 &&
cd .. &&
# deploy frontend to vercel
cd frontend-landing-page &&
vercel --prod