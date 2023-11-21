#!/bin/bash
set -e
cd /home/ec2-user/rundsted-report-server
rm -r node_modules/
yarn install
yarn build