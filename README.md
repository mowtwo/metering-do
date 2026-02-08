# Metering Do - 个人资产费用追踪

一个帮助你追踪个人资产持有成本的 PWA 应用。不仅记录购买价格，还能追踪资产相关的各类支出（初始费用、一次性支出、周期性费用、出售收入等），并自动计算日均成本、净成本等关键指标。

**在线访问：[https://metering.mowtwo.com/](https://metering.mowtwo.com/)**

## 功能特性

- **资产管理** - 创建和管理个人资产，支持分类、子分类和 Emoji 标识
- **多类型费用记录** - 支持初始费用、一次性支出、周期性费用（日/月/年）、出售收入四种类型
- **自动费用计算** - 自动计算总成本、净成本、日均成本、持有天数等指标
- **全局统计** - 首页展示所有资产的总净成本、平均日均成本概览
- **模糊搜索** - 按资产名称快速搜索，支持多种排序方式
- **分类管理** - 预置电子产品、家居、出行、穿搭、娱乐等分类，支持自定义
- **多种视图** - 卡片视图和列表视图自由切换
- **主题皮肤** - 内置简约、P5、科技三种主题风格
- **数据导入/导出** - 支持 JSON 格式的数据备份与恢复
- **纯本地存储** - 所有数据存储在浏览器 IndexedDB 中，保护隐私
- **PWA 支持** - 可安装到桌面，支持离线使用

## 技术栈

- **框架**: Next.js 16 + React 19 + TypeScript
- **样式**: Tailwind CSS 4 + Shadcn/ui + Radix UI
- **数据存储**: Dexie (IndexedDB)
- **表单**: React Hook Form + Zod
- **搜索**: Fuse.js
- **PWA**: Serwist

## 开始使用

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## 项目结构

```
src/
├── app/            # 页面路由
├── components/     # UI 组件
│   ├── assets/     # 资产相关组件
│   ├── expenses/   # 费用相关组件
│   ├── categories/ # 分类管理组件
│   ├── search/     # 搜索与筛选
│   ├── layout/     # 布局组件
│   └── ui/         # 基础 UI 组件
├── hooks/          # 自定义 Hooks
├── lib/            # 工具函数与数据库
└── types/          # TypeScript 类型定义
```
