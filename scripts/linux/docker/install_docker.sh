#!/bin/bash

# 定义Docker安装包路径
DOCKER_DEB_PATH="/path/to/docker-ce_20.10.25~3-0~ubuntu-focal_amd64.deb"
# 定义Docker Compose二进制文件路径（可选）
DOCKER_COMPOSE_BIN_PATH="/path/to/docker-compose"

# 安装依赖
echo "正在安装依赖..."
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common


# 安装Docker
echo "正在安装Docker..."
sudo dpkg -i "$DOCKER_DEB_PATH"
if [ $? -ne 0 ]; then
    echo "安装Docker失败，请检查安装包路径是否正确。"
    exit 1
fi

# 添加当前用户到docker组（可选）
echo "将当前用户添加到docker组..."
sudo usermod -aG docker $USER

# 安装Docker Compose（可选）
if [ -f "$DOCKER_COMPOSE_BIN_PATH" ]; then
    echo "正在安装Docker Compose..."
    sudo mv "$DOCKER_COMPOSE_BIN_PATH" /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose安装完成。"
else
    echo "未找到Docker Compose安装文件，跳过安装。"
fi

# 验证Docker是否安装成功
echo "验证Docker是否安装成功..."
sudo docker run hello-world
if [ $? -eq 0 ]; then
    echo "Docker安装成功！"
else
    echo "Docker安装失败，请检查日志。"
    exit 1
fi

echo "Docker安装脚本执行完成。"
