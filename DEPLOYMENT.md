# MacroBet 部署指南

## 1. 推送到 GitHub

首先需要登录 GitHub CLI：

```bash
gh auth login
```

然后创建仓库并推送：

```bash
gh repo create MacroBet --public --source=. --push
```

---

## 2. 部署后端到 Railway

### 2.1 在 Railway 创建项目

1. 访问 [railway.app](https://railway.app) 并登录
2. 点击 **"New Project"** → **"Deploy from GitHub repo"**
3. 选择 `MacroBet` 仓库
4. 选择 **Root Directory**: `backend`

### 2.2 添加 PostgreSQL 数据库

1. 在项目中点击 **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway 会自动创建并注入 `DATABASE_URL` 环境变量

### 2.3 添加 Redis

1. 在项目中点击 **"+ New"** → **"Database"** → **"Add Redis"**
2. Railway 会自动注入 `REDIS_URL` 环境变量

### 2.4 配置环境变量

在 Backend 服务的 **Variables** 选项卡添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DB_HOST` | `${{Postgres.PGHOST}}` | PostgreSQL 主机 |
| `DB_PORT` | `${{Postgres.PGPORT}}` | PostgreSQL 端口 |
| `DB_USER` | `${{Postgres.PGUSER}}` | PostgreSQL 用户名 |
| `DB_PASS` | `${{Postgres.PGPASSWORD}}` | PostgreSQL 密码 |
| `DB_NAME` | `${{Postgres.PGDATABASE}}` | PostgreSQL 数据库名 |
| `REDIS_HOST` | `${{Redis.REDISHOST}}` | Redis 主机 |
| `REDIS_PORT` | `${{Redis.REDISPORT}}` | Redis 端口 |
| `CORS_ORIGIN` | `https://your-frontend.vercel.app` | 前端 URL（部署后更新） |

### 2.5 配置部署设置

在 **Settings** 选项卡：
- **Root Directory**: `backend`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`

---

## 3. 部署前端到 Vercel

### 3.1 导入项目

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 **"New Project"** → **"Import Git Repository"**
3. 选择 `MacroBet` 仓库

### 3.2 配置项目设置

| 设置项 | 值 |
|--------|-----|
| **Root Directory** | `frontend` |
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3.3 添加环境变量（可选）

如果前端需要连接后端 API：

| 变量名 | 值 |
|--------|-----|
| `VITE_API_URL` | `https://your-backend.railway.app` |

### 3.4 部署

点击 **"Deploy"** 等待部署完成。

---

## 4. 部署后配置

### 4.1 更新 Railway CORS

部署 Vercel 后，回到 Railway 更新 `CORS_ORIGIN`：

```
CORS_ORIGIN=https://macrobet.vercel.app
```

### 4.2 验证部署

- **前端**: `https://macrobet.vercel.app`
- **后端 API**: `https://macrobet-backend.railway.app`
- **Swagger 文档**: `https://macrobet-backend.railway.app/api/docs`

---

## 快速命令参考

```bash
# 登录 GitHub CLI
gh auth login

# 创建并推送仓库
gh repo create MacroBet --public --source=. --push

# 查看仓库
gh repo view --web
```
