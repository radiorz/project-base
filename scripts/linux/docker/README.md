# 使用说明

## 下载Docker安装包：
从Docker官网下载适用于Ubuntu的.deb安装包，将其保存到本地路径（如/path/to/docker-ce_20.10.25~3-0~ubuntu-focal_amd64.deb）

## 下载Docker Compose（可选）：
如果需要使用Docker Compose，可以从其GitHub Releases页面下载二进制文件，并将其路径设置为DOCKER_COMPOSE_BIN_PATH。
修改脚本中的路径：将脚本中的DOCKER_DEB_PATH和DOCKER_COMPOSE_BIN_PATH替换为实际的文件路径。
运行脚本：将脚本保存为install_docker.sh，并运行以下命令：
```bash
chmod +x install_docker.sh
./install_docker.sh
```
注意事项
确保下载的Docker安装包与你的Ubuntu版本兼容。
如果在安装过程中遇到依赖问题，可以手动安装缺少的依赖包。
如果需要使用Docker Compose，请确保下载的版本与Docker版本兼容。
