# 素材来源与生成

## CyberUI

- 来源：Arasaka-Academy/CyberUI，固定提交 `e31c0355b2b5189c9af1e6e26150f28a44287659`。
- 消费官方 `registry.json` 的 button、icon-button 项及其依赖闭包；原始源码逐字保留，包括上游注释与许可。
- 重新接入：`node scripts/sync-cyberui.mjs`。此操作会覆盖本地 vendor 源码，应单独审阅。

## 字体

- Oxanium / Share Tech Mono：来自上述固定 CyberUI 提交的字体文件。
- Noto Sans SC：来自 Google Fonts 的 `ofl/notosanssc`。
- 均为 SIL Open Font License，许可位于 `public/fonts/licenses/`。
- 页面只请求本地 WOFF2；中文按当前源码字符制作子集，保留可变字重。
- 生成需要 `fonttools` 和 Brotli：`node scripts/prepare-fonts.mjs`。普通安装和构建不需要这些工具或相邻项目。
- 新增中文文案后重新生成；`public/fonts/characters.txt` 保存本次子集字符集合。

## CyberOS 实际界面

- 参考源码：Arasaka-Academy/CyberOS `d9a8a5738b10e84a85c82fa00cb8a97d62049ba5`。截图源工作区可能包含本地视觉修改，因此不声称是干净发布构建。
- 不是构造出来的仿制界面：实际运行 CyberOS Web 前端，由 Playwright 截取。
- 使用全新浏览器上下文，所有 `/api/**`、健康与事件请求都由演示 fixture 拦截；文件名、会话与存储信息均为预先编写的非个人数据。
- 不读取正式用户目录、Token、在线设备或运行中的主机数据，不连接真实 API。
- 重新生成：`CYBEROS_SOURCE=/path/to/CyberOS node scripts/capture-cyberos.mjs`。需要该项目自己的依赖已安装；Vite 缓存写入临时目录。
- 这仅证明实际前端渲染，不证明展示主机的实时功能或物理设备验收。

## CyberMachine 数字结构

- 来源：Arasaka-Academy/CyberMachine `bad1f7f7d4f72a296fcca2286984ff70e44040ca`，`docs/images/r2/exploded.png`。
- 转换为本地 WebP，未把展示爆炸位移描述为真实装配行程。
- 页面始终注明 R2 数字装配示意，不宣称制造或实物试装完成。
- 生成：`node scripts/prepare-media.mjs`，也会生成分享图和 Apple 图标。

## 原创官网图形

- 组织几何字标、生态海报、CyberVisual / CyberController / CyberAudio / CyberUI 插画及分享图均在本仓库创建。
- 源码：`scripts/generate-artwork.mjs`、`src/components/brand.tsx`、`src/components/device-scene.ts`。
- 插画只表达项目能力，不冒充产品实拍、设备在线数据或具体性能指标。
- 生成：`node scripts/generate-artwork.mjs`。
- `ecosystem-poster.webp` 由同一 Three.js 场景截取透明画面生成，保证静态降级与桌面增强的装置、构图一致。启动生产预览后执行 `node scripts/capture-poster.mjs` 更新；SVG 版保留为原创草图。

## 复现顺序

```sh
node scripts/generate-artwork.mjs
node scripts/prepare-fonts.mjs
node scripts/prepare-media.mjs
CYBEROS_SOURCE=/path/to/CyberOS node scripts/capture-cyberos.mjs
pnpm check
```

所有结果均随仓库提供。部署与普通构建完全不需要下载原始图形、字体、相邻项目或 22 MB 装配模型。
