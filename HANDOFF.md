# HANDOFF —— resume-lint
> 更新时间：2026-09-15（第四会话）· 主题：上线链接回填 + v0.2.0 发布就绪

## 现在在哪（一句话）
**已上线**：https://resume-lint.ikoobee.com （Cloudflare Pages，HTTP/2 200 验证过）——链接全部回填，发布物料就绪，进入发布序列。

## 已完成（本会话）
- [x] 线上验证：站点 200、标题正确、og-image 以 image/png 提供、CF 安全头就位
- [x] 链接回填：README×2（在线使用入口）、index.html（canonical + og:url + og:image 绝对地址——抓取器要求绝对 URL，V2EX/HN 预览卡片依赖它）、launch 两份草稿
- [x] v0.2.0 tag（含 .txt/.md 拖入 + 链接回填）

## 进行中（未完成）
- 无

## 下一步（按优先级）
1. **发布序列（oss-launch）**——发布动作需用户账号执行：
   a. V2EX「分享创造」发帖（草稿：`docs/launch/v2ex-draft.md`，工作日上午 10-11 点）
   b. 隔 1-2 天 Show HN（草稿：`docs/launch/show-hn-draft.md`，周二~四北京时间 21-23 点）
   c. 发布 48h 内全时段回复评论
2. 发布周后（一周例程，growth-analytics）：UV/克隆数/star 走势记录进 `docs/`，拿真实简历反馈校准阈值
3. GSC 验证（需用户 Google 账号；ikoobee.com 若已有 Search Console 直接加子域属性）
4. 有留存后：VALIDATION.md 补 waitlist 冒烟数据 → 决定付费层（虎皮椒 ¥9.9 + Polar $1.99，见 STRATEGY.md）
5. og-image 换带文字设计版（当前为几何占位）

## 关键决策记录（本会话新增）
- og:image/canonical 用绝对 URL：社交抓取器不解析相对路径，发布预览卡片的前提
- 发布帖由用户账号发（V2EX/HN 需真实账号信誉），AI 备好草稿与回复预案

## 环境与注意事项
- push 前仓库身份三连（见 d:\dev\CLAUDE.md）；本仓现位于 `d:\dev\oss\resume-lint`（2026-09-15 迁移完成并核验）
- 测试 `npm test`（19/19）；Pages 连 main 自动部署，push 即上线
- 变现定位（ARCHITECTURE.md 定稿）：触发付费时 **L0 数字内容交付起步**（《简历改写手册》上架 LS/Polar），按阶梯证据升档
