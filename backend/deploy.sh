pm2 stop all
git pull --no-edit
yarn
pm2 start ./startup.sh