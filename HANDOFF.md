# HANDOFF —— resume-lint
> 更新时间：2026-09-15（第二会话）· 主题：部署准备 + 校准 + 发布物料

## 现在在哪（一句话）
v0.1.1 候选：资产补齐（favicon/OG/robots）、长度阈值校准（600→500）、中英 README、双渠道发布文案就绪——**只差建远端仓库 + push + Pages 点两下**。

## 已完成（本会话）
- [x] 部署资产：favicon.svg + apple-touch-icon.png（零依赖 PNG 生成器 `scripts/make-assets.mjs`，可重跑）+ og-image.png + robots.txt；PNG 结构 CRC 校验 + 视觉目检通过
- [x] index.html 接入全部资产（og:image / twitter:card / icon 链接）
- [x] 规则校准：length 下限 600→500（一页精简简历常 500-800 字），含边界回归测试；19/19 全绿
- [x] README 改英文主 + README.zh-CN.md 中文副（符合 OSS 惯例 + Show HN 前置）
- [x] 发布物料：`docs/launch/v2ex-draft.md` + `docs/launch/show-hn-draft.md`（按 oss-launch 模板，含回复预案）
- [x] ShipCheck 复检：**公网 GO**

## 进行中（未完成）
- 远端仓库 `ikoobee/resume-lint` **不存在**（已 ls-remote 验证）——等用户网页创建

## 下一步（按优先级）
1. 用户在 GitHub 网页建空仓库 `resume-lint` → 告知 AI → `git remote add origin git@github.com:ikoobee/resume-lint.git` → `git ls-remote` 验证 → push → 打 tag `v0.1.0`
2. Cloudflare Pages 连接仓库部署（静态站，无构建命令）
3. 部署后：把在线链接回填到两份发布草稿 + README + index.html hero 的 GitHub 链接
4. 发布序列（oss-launch）：V2EX 先（中文主场）→ 隔 1-2 天 Show HN
5. 发布周后：拿真实反馈校准规则阈值 → v0.2（.txt/.md 拖入）
6. 有留存后：waitlist 冒烟数据回填 VALIDATION.md → 决定是否做付费层

## 关键决策记录（本会话新增）
- length 下限放宽到 500：校招/精简一页简历误报代价 > 漏报
- OG 用几何占位（无文字渲染能力的零依赖生成器）：可接受，正式版待替换
- 埋点维持为零：隐私叙事与增长需求的冲突，隐私优先（写入 SHIP-CHECK 决策）

## 环境与注意事项
- 资产重生成：`node scripts/make-assets.mjs`
- 测试命令 `npm test`（Windows 下 `node --test` 别带 `tests/` 尾斜杠）
- 零依赖保持：PR 指南已写明

## 对 skills 体系的回填（第二会话新增）
5. ship-check 的「本地 GO / 公网 NO-GO」双态判定在本项目被证明关键 → 已回填到 indie-dev-skills 的 ship-check SKILL.md
