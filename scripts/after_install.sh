#!/bin/bash
set -e
cd /home/ec2-user/rundsted-report-server
yarn install
yarn build