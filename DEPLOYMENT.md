# Vercel 部署指南

## 前置条件

- GitHub 账户（已配置）
- Vercel 账户
- 项目代码已推送到 GitHub

## 部署步骤

### 方法 1：通过 Vercel 仪表板（推荐）

1. **访问 Vercel 仪表板**
   - 打开 https://vercel.com/dashboard
   - 使用您的 GitHub 账户登录

2. **导入项目**
   - 点击 "Add New..." 按钮
   - 选择 "Project"
   - 点击 "Import Git Repository"
   - 搜索 `QminAI/xhscover`
   - 点击 "Import"

3. **配置项目设置**
   - **Project Name**: xhscover（或您喜欢的名称）
   - **Framework**: Vite
   - **Root Directory**: ./（保持默认）
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. **配置环境变量**
   
   在 "Environment Variables" 部分添加以下变量：

   ```
   DATABASE_URL=<your_supabase_connection_string>
   JWT_SECRET=<your_jwt_secret>
   VITE_APP_ID=<your_app_id>
   OAUTH_SERVER_URL=<your_oauth_server_url>
   VITE_OAUTH_PORTAL_URL=<your_oauth_portal_url>
   OWNER_OPEN_ID=<your_owner_id>
   OWNER_NAME=<your_name>
   BUILT_IN_FORGE_API_URL=<your_api_url>
   BUILT_IN_FORGE_API_KEY=<your_api_key>
   VITE_FRONTEND_FORGE_API_KEY=<your_frontend_key>
   VITE_FRONTEND_FORGE_API_URL=<your_frontend_api_url>
   CLERK_SECRET_KEY=<your_clerk_secret_key>
   VITE_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
   VITE_APP_TITLE=小红书创作助手
   VITE_APP_LOGO=<your_logo_url>
   ```

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待部署完成（通常需要 3-5 分钟）
   - 部署完成后，您将获得一个 `.vercel.app` 域名

### 方法 2：使用 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   cd /home/ubuntu/xhs-cover-generator
   vercel --prod
   ```

4. **按照提示配置项目**
   - 选择 "Link to existing project"（如果已在 Vercel 中创建）
   - 或选择 "Create a new project"
   - 配置环境变量
   - 完成部署

## 部署后的配置

### 1. 配置自定义域名（可选）

1. 在 Vercel 项目设置中找到 "Domains"
2. 点击 "Add" 添加您的自定义域名
3. 按照 DNS 配置说明更新您的域名提供商设置

### 2. 验证部署

部署完成后，访问您的应用 URL：
- Vercel 自动生成的 URL：`https://xhscover.vercel.app`
- 或您配置的自定义域名

### 3. 监控和日志

- 在 Vercel 仪表板中查看部署日志
- 使用 "Deployments" 标签查看部署历史
- 使用 "Analytics" 标签查看应用性能指标

## 环境变量获取指南

### 从 Manus 项目获取环境变量

1. 打开 Manus 项目管理界面
2. 进入 "Settings" → "Secrets"
3. 复制所有环境变量值
4. 在 Vercel 中配置这些变量

### Clerk 配置

1. 访问 https://dashboard.clerk.com
2. 选择您的应用
3. 在 "API Keys" 中找到：
   - `CLERK_SECRET_KEY`
   - `VITE_CLERK_PUBLISHABLE_KEY`

### Supabase 配置

1. 访问 https://app.supabase.com
2. 选择您的项目
3. 在 "Settings" → "Database" 中找到：
   - `DATABASE_URL`（连接字符串）

## 常见问题

### 1. 部署失败：找不到依赖

**解决方案**：
```bash
# 确保 pnpm-lock.yaml 已提交
git add pnpm-lock.yaml
git commit -m "Add pnpm lock file"
git push origin main
```

### 2. 部署成功但应用无法访问

**检查项**：
- 环境变量是否正确配置
- 数据库连接是否正常
- OAuth 配置是否完整

### 3. 构建超时

**解决方案**：
- 增加 Vercel 构建超时时间
- 优化项目大小和依赖

## 自动部署

配置完成后，每当您推送代码到 GitHub main 分支时，Vercel 会自动部署新版本。

```bash
# 推送代码
git add .
git commit -m "Your commit message"
git push origin main

# Vercel 会自动检测并部署
```

## 回滚部署

如果需要回滚到之前的版本：

1. 在 Vercel 仪表板中打开项目
2. 进入 "Deployments" 标签
3. 找到您想要的版本
4. 点击 "..." 菜单
5. 选择 "Promote to Production"

## 支持

如有问题，请：
- 查看 Vercel 官方文档：https://vercel.com/docs
- 联系 Vercel 支持：https://vercel.com/support
- 提交 GitHub Issue：https://github.com/QminAI/xhscover/issues

---

部署完成后，您的应用将在互联网上公开可访问！
