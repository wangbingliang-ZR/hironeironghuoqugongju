#!/bin/bash

# HIRO AI 一键部署脚本
# 运行方式: bash deploy.sh

echo "=== HIRO AI 部署开始 ==="

# 1. 安装 Node.js 18
echo "[1/6] 安装 Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 2. 安装 PM2 (进程管理)
echo "[2/6] 安装 PM2..."
npm install -g pm2

# 3. 创建项目目录
echo "[3/6] 创建项目目录..."
mkdir -p /var/www/hiro-ai
cd /var/www/hiro-ai

# 4. 提示用户上传代码
echo "[4/6] 请上传项目代码到 /var/www/hiro-ai"
echo "可以通过 git clone 或 scp 上传"

# 5. 安装依赖
echo "[5/6] 安装依赖..."
npm install

# 6. 构建并启动
echo "[6/6] 构建并启动..."
npm run build
pm2 start npm --name "hiro-ai" -- start

# 保存 PM2 进程列表，开机自启
pm2 save
pm2 startup

echo "=== 部署完成 ==="
echo "访问地址: http://你的服务器IP:3000"
echo ""
echo "常用命令:"
echo "  pm2 status        - 查看状态"
echo "  pm2 logs hiro-ai  - 查看日志"
echo "  pm2 restart       - 重启"
