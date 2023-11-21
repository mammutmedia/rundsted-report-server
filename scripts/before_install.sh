#!/bin/bash
# Install node.js and PM2 globally
sudo apt-get update 
sudo apt-get install node@18.15.0 -y
sudo apt-get install npm  -y
sudo apt-get install yarn  -y
sudo npm install pm2 -g