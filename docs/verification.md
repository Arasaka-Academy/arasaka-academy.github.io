# 官网验收记录

验证日期：2026-11-08。本文分别记录本地生产构建、GitHub CI 和已部署网站的实际证据，不把本地通过等同于线上发布成功。

## 本地环境

- macOS，Node.js 22.22.0，pnpm 11.3.0。
- 由 `pnpm build` 静态导出 `out/`，在 `http://127.0.0.1:4173` 使用静态 HTTP 服务验证。
- 普通安装与构建不依赖相邻仓库；`pnpm install --frozen-lockfile --offline` 已通过。
- 生产依赖审计未发现已知漏洞；此结论仅对应本次锁定依赖与审计数据库快照。

## 内容、构建与浏览器

| 验证 | 实际结果 |
| --- | --- |
| TypeScript、ESLint、生产静态构建 | 通过，Lint 无警告 |
| Vitest | 2 个文件、8 项测试通过 |
| 固定 CyberUI 源码 | 提交及全部文件 SHA-256 校验通过，保留上游许可 |
| Playwright Chromium | 33 项通过 |
| 手动滚动后语言切换 | 原回归修复后连续重复 5 次通过，导航不再触发意外回滚 |
| 明确章节与快速语言切换 | 平滑滚动、5 倍 CPU 节流、重复选择相同 hash 三类回归分别重复 5 次通过 |
| React 尚未加载 | 拦截全部应用 JS 后，中英双向切换仍保留深层章节；该回归及 CPU 节流回归分别重复 5 次通过 |
| 中英文响应式 | 320、390、768、1024、1440、1920 px 均无横向溢出 |
| Axe | 两种语言的 WCAG 2 A/AA、2.1 AA 自动扫描均为零违规 |
| 静态可用性 | 中英文直接访问、无 JavaScript 内容、404 返回首页均通过 |
| 三维降级 | 移动端、减少动态、节流流量、WebGL 不可用、下载失败、GPU 上下文丢失均保留海报 |
| 三维生命周期 | 离屏暂停、动态偏好切换、销毁释放均有浏览器回归覆盖 |

交互覆盖还包含桌面章节跳转、移动菜单展开及关闭、Escape 返回焦点、跳过导航、项目仓库链接和语言切换。自动化无障碍扫描不等于完整的人工 WCAG 认证。

## 最终移动端 Lighthouse

Lighthouse 13.6.0，移动端模拟、默认模拟节流、每页重置存储。下表为修复导航后的生产构建最新一次隔离测量，未并发运行构建、截图或浏览器测试。

| 语言 | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 中文 | 94 | 100 | 100 | 100 | 3.1 s | 20 ms | 0 |
| English | 96 | 100 | 100 | 100 | 2.8 s | 20 ms | 0 |

达到本期 Performance ≥90、Accessibility ≥95 的本地目标。分数会受设备、网络与浏览器版本影响，不代表真实用户的现场指标。

早期一次中文测量为 68 分；最终海报已改为从同一三维场景生成的轻量 WebP，并在无其他浏览器工作负载时复测。未将早期长任务的具体成因认定为已证明。

本地完整 JSON/HTML 报告保留在 `artifacts/lighthouse/`；导航修复前两轮为中文 94、英文 99，其中一轮在 `artifacts/lighthouse-final-first/`，早期结果在 `artifacts/lighthouse-initial/`。这些大体积生成记录不纳入源码仓库；可运行 `pnpm audit:performance` 重新生成。

## 实际视觉复核

- 已在公开站点重新截取并查看中英文 1440 × 1000 桌面与 390 × 844 手机首屏，以及两种语言的完整长页面。
- 大字标、五盘位生态装置、六项目错落展位、产品实景与参与章节均正常；中文无缺字，未发现明显截断、重叠或失效图片。
- CyberOS 展示由实际前端配合全拦截演示数据生成，不包含个人文件、主机地址或凭据；CyberMachine 画面保持数字装配而非实物制造的声明。
- 四张首屏预览随仓库保存在 `docs/images/`；原始 PNG、全页图与手机分段复核图在本地 `artifacts/screenshots/`。

## 远端发布与线上验收

GitHub CLI 授权已恢复，已确认组织管理员及仓库 Pages 管理权限。公开仓库 `Arasaka-Academy/arasaka-academy.github.io` 已创建，Pages 来源为 GitHub Actions，HTTPS 已启用，无自定义域名。

- 中文：https://arasaka-academy.github.io/
- English: https://arasaka-academy.github.io/en/
- 仓库：https://github.com/Arasaka-Academy/arasaka-academy.github.io
- 应用修复提交：`1bffae3da0a3300d358fc3704cd879f124ebb76e`。
- 该提交的检查与部署均成功：GitHub Actions 运行 `42494436795`，33 项浏览器测试首次通过，无 flaky 或重试通过项。
- 部署成功后，对公开域名独立执行完整的 33 项浏览器测试，全部通过，未启用重试。

首次工作流遇到 `ubuntu-latest` 已迁移至锁定 Playwright 尚不支持的 Ubuntu 26.04，现固定使用 `ubuntu-24.04`。首次成功部署的 `bb8561e` 有一项语言切换测试重试后通过；随后复现并修复了平滑滚动期间中间章节覆盖显式目标的问题，包括相同 hash 再次选择和繁忙 CPU 下的切换。失败下载测试也改为等待路由处理器退出，避免测试销毁竞态。

线上压力测试进一步复现了 React 尚未完成加载时快速点击语言链接会丢失章节的问题。静态 HTML 现在通过短小的内联引导脚本初始化语言链接，仅接受共享的章节白名单，不依赖 React 加载完成；水合后仍由导航组件管理当前章节。另将短暂滚动窗口的观察放在首次 GPU 初始化完成之后，并使用真实滚轮建立同 hash 再次选择的前置状态；两项滚动回归在公开网站各重复 5 次通过，保留了早期失败 trace。

文档提交后的 CI 又暴露同 hash 回归可能漏采短暂的中间滚动窗口：失败截图已到达正确章节，但测试仍在等待已经错过的瞬时位置。回归现在在捕获阶段的首个滚动事件固定中间位置，再验证语言切换仍指向原目标；保留原断言，不通过增加超时或重试掩盖问题。两项确定性回归各在本地重复 10 次、线上重复 5 次通过，随后本地完整 33 项再次通过。失败运行 `42495078854` 的 trace 保留在本地 `artifacts/deployment/final-ci-first-failure/`。

独立 HTTP 验收确认中英文首页、sitemap、robots 均返回 200，未知路由返回 404 及自定义页面；20 个公开静态素材与本地 SHA-256 逐字节一致。既有 `/CyberUI/`、`/CyberMachine/` 均为 200，首页 HTML SHA-256 与发布前基线完全一致。记录保留在本地 `artifacts/deployment/`。

另对中英文桌面与手机共四种线上视图逐章浏览：控制台 error、页面异常、资源请求失败、HTTP 错误、失效图片与站外资源请求均为零。桌面三维正常启用，手机保持静态海报。独立记录为 `artifacts/deployment/browser-audit.json`，HTTP 与素材比对为 `artifacts/deployment/live-http.json`；这两项不包含故意注入故障的降级测试。

GitHub API 确认组织及六个项目仓库均公开存在；额外的 CyberVisual 项目展示链接也返回 HTTP 200。直接请求 GitHub 网页曾遇到本机网络连接超时，因此仓库存在性使用认证 API 证据，不将网络超时描述为项目链接不存在。

复验线上站点：

```sh
SITE_URL=https://arasaka-academy.github.io pnpm test:e2e
SITE_URL=https://arasaka-academy.github.io node scripts/capture-homepage.mjs
```

不修改其他项目仓库，不设置自定义域名，不接入追踪统计，也不把软件浏览器验证当作硬件、设备语音或物理制造验收。
