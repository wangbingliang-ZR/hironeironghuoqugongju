# 服务器部署步骤

## 方式一：通过宝塔面板部署（推荐）

1. 打开宝塔面板: http://117.50.91.79:8888
2. 登录后点击 "Node.js 项目"
3. 添加项目：
   - 项目路径: /var/www/hiro-ai
   - 项目名称: hiro-ai
   - 启动命令: npm run dev 或 npm run start
   - 端口: 3000
4. 在本地打包代码上传，或使用 git clone

## 方式二：命令行部署

```bash
# 1. SSH 登录服务器
ssh root@117.50.91.79

# 2. 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 3. 创建目录
mkdir -p /var/www/hiro-ai
cd /var/www/hiro-ai

# 4. 上传代码（从本机执行）
# 如果用 git:
git clone 你的项目仓库 /var/www/hiro-ai

# 或者用 scp 上传本地代码
scp -r ./hiro-ai-content-sales-os root@117.50.91.79:/var/www/

# 5. 安装依赖
cd /var/www/hiro-ai
npm install

# 6. 创建 .env.local 文件
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=你的Supabase地址
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase Key
DEEPSEEK_API_KEY=你的DeepSeek Key
DEEPSEEK_BASE_URL=https://api.deepseek.com
EOF

# 7. 构建
npm run build

# 8. 用 PM2 保持运行
npm install -g pm2
pm2 start npm --name "hiro-ai" -- start
pm2 save

# 9. 开放端口
firewall-cmd --add-port=3000/tcp --permanent
firewall-cmd --reload
```

## 访问

部署成功后访问: http://117.50.91.79:3000
