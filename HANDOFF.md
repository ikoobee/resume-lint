# HANDOFF —— resume-lint
> 更新时间：2026-09-15（第三会话）· 主题：远端推送 + v0.2 文件拖入

## 现在在哪（一句话）
已推送到 GitHub（main + v0.1.0 tag）；v0.2 的 .txt/.md 拖入完成待提交——**卡在 Cloudflare Pages 连接（需用户网页操作）**。

## 已完成（本会话）
- [x] 远端推送：`ikoobee/resume-lint` main @ 508635d + tag v0.1.0（已 ls-remote 复核）
- [x] v0.2：.txt/.md 拖入 + 文件选择按钮（FileReader 本地读取；拖拽视觉反馈；类型/大小校验；6 用例冒烟通过）
- [x] README×2 roadmap 勾选

## ⚠️ 事故记录（重要，流程改进）
推送时 bash 工作目录残留在上一个仓库（indie-dev-skills），把错误内容推到了 resume-lint 远端。
**已修复**：移除错误 remote + 从正确仓库 force push 覆盖 + ls-remote 复核正确。
**教训**：push 前不仅验远端存在，还要验**当前仓库身份**（`pwd` + `git log --oneline -1` + `git remote -v`）。
此规则建议纳入 D:\Workspace 根 CLAUDE.md 的 git 纪律条款。

## 进行中（未完成）
- v0.2 改动**尚未 commit/push**（等本会话收尾时一起提交）

## 下一步（按优先级）
1. **用户**：Cloudflare Pages → 连接 `ikoobee/resume-lint` → 构建命令留空 → 输出目录 `/`
2. 拿到部署 URL 后 AI 回填：README×2、docs/launch/ 两份草稿的占位链接、index.html（如需）
3. 发布序列（oss-launch）：V2EX「分享创造」先发（草稿就绪）→ 隔 1-2 天 Show HN
4. 发布周后：真实简历反馈 → 校准阈值 → v0.2 tag
5. 有留存后：waitlist 冒烟数据回填 VALIDATION.md → 决定付费层

## 关键决策记录（本会话新增）
- 文件拖入限制 1MB + 仅 .txt/.md/.markdown：防误拖非简历文件，PDF 明确告知「在路上」
- FileReader 本地读取文案与隐私叙事一致（无网络请求）

## 环境与注意事项
- **push 前必验仓库身份**（见事故记录）
- 测试 `npm test`（19/19）；文件拖入的 UI 部分无浏览器自动化，上线后手动过一遍
- 资产重生成：`node scripts/make-assets.mjs`
