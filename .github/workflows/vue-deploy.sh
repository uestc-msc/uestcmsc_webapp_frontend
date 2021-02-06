#!/bin/bash
set -xe

cd /etc/uestcmsc_webapp/frontend
# 拉取源代码
git fetch origin dist
git reset --hard origin/dist
