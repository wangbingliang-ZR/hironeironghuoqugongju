# HIRO AI - AI Content Sales OS

AI 内容销售操作系统，帮助用户完成 内容 → 线索 → 跟进 → 转化 完整链路。

## 技术栈

- **Frontend**: Next.js + React + TypeScript + Tailwind
- **Backend**: Supabase (Database + Auth + Storage)
- **AI**: DeepSeek Chat API

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## MVP 功能

- [x] Dashboard 布局
- [x] Sidebar 导航
- [x] 页面骨架
- [ ] 内容生成模块
- [ ] Leads 客户管理
- [ ] Follow-up 跟进管理
- [ ] AI 建议功能

## 项目结构

```
/app              - Next.js App Router
/components       - React 组件
/lib              - 工具库
/services         - API 服务
/prompts          - AI Prompt
/types            - TypeScript 类型
/brain            - 项目记忆层
```

## 开发规范

- 优先 MVP
- 每次只开发一个闭环
- 不做过度工程
- 代码必须易读
