#!/bin/bash
apt-get update && apt-get upgrade

apt-get install docker.io

# 开启
systemctl start docker
systemctl enable docker

# 验证
docker --version
