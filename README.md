# XHS Cover Generator - 小红书创作助手

一个强大的小红书封面生成工具，支持 AI 图像处理、文字叠加、实时预览和高质量导出。

## 功能特性

- 🎨 **AI 图像处理**：智能处理用户上传的照片，生成优化的小红书封面
- 👤 **用户认证**：集成 Clerk OAuth 实现安全的用户认证
- 💎 **积分系统**：用户注册获得免费积分，支持 VIP 管理
- 📝 **文字编辑**：支持标题、副标题的实时编辑和预览
- 🎬 **Canvas 编辑器**：使用 Fabric.js 实现 3:4 比例的专业画布编辑
- 💾 **高质量导出**：支持导出为高质量 PNG 图片
- 📊 **数据持久化**：使用 Supabase + Prisma 存储用户信息和生成记录
- ✨ **优雅设计**：现代化的红色主题设计，流畅的用户体验

## 技术栈

- **前端**：React 19 + Tailwind CSS 4 + Vite
- **后端**：Express 4 + tRPC 11
- **认证**：Clerk OAuth
- **数据库**：Supabase (PostgreSQL) + Prisma ORM
- **Canvas 编辑**：Fabric.js
- **文件存储**：S3
- **测试**：Vitest

## 快速开始

### 环境要求

- Node.js 22.13.0+
- pnpm 10.4.1+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

### 运行测试

```bash
pnpm test
```

## 项目结构

```
xhs-cover-generator/
├── client/                 # React 前端应用
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   ├── components/    # 可复用组件
│   │   ├── lib/           # 工具函数
│   │   └── App.tsx        # 主应用组件
│   └── public/            # 静态资源
├── server/                # Express 后端服务
│   ├── routers.ts         # tRPC 路由定义
│   ├── db.ts              # 数据库操作
│   └── _core/             # 核心框架代码
├── drizzle/               # 数据库 Schema
├── storage/               # S3 存储操作
└── shared/                # 共享常量和类型
```

## 环境变量

需要配置以下环境变量：

```
# 数据库
DATABASE_URL=your_supabase_connection_string

# 认证
CLERK_SECRET_KEY=your_clerk_secret_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# OAuth
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=your_oauth_server_url
VITE_OAUTH_PORTAL_URL=your_oauth_portal_url

# 用户信息
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=your_name

# API 服务
BUILT_IN_FORGE_API_URL=your_api_url
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=your_frontend_api_url

# 应用配置
VITE_APP_TITLE=小红书创作助手
VITE_APP_LOGO=your_logo_url
JWT_SECRET=your_jwt_secret
```

## API 端点

### 认证
- `GET /api/oauth/callback` - OAuth 回调处理
- `POST /api/trpc/auth.me` - 获取当前用户信息
- `POST /api/trpc/auth.logout` - 用户登出

### 生成
- `POST /api/trpc/generation.generate` - 生成封面
- `GET /api/trpc/generation.getHistory` - 获取生成历史

### 用户
- `GET /api/trpc/user.getProfile` - 获取用户资料
- `POST /api/trpc/user.updateProfile` - 更新用户资料

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署

```bash
# 推送到 GitHub
git push origin main

# Vercel 会自动部署
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT

## 联系方式

- 邮箱：mengjie.xiao@outlook.com
- GitHub：https://github.com/QminAI/xhscover

---

Made with ❤️ by Vivi
