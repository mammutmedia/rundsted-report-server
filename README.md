<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# helper

extract pages: pdftoppm e4f-v4.pdf page -png -r 300

# Build

1. Login to server via SSH: `sudo ssh -i E4F-Report-Key.pem [user@IP]`
2. Stop current Process `pm2 stop [id]`
3. Pull Latest Changes `git pull`
4. Build App `yarn build` (build file now in /dist) - if necessary `yarn install`
5. Run `pm2 start dist/main.js`
