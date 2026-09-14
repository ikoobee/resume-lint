# Ship Check —— resume-lint v0.1.0（2026-09-15 · 复检）

> 第二次运行（部署前待办已补齐）。

| 维度 | 项 | 状态 |
|---|---|---|
| 技术 | 环境变量/密钥 | ✅ N/A（纯静态） |
| 技术 | 错误处理 | ✅ 空输入引导态 |
| 技术 | 回滚 | ✅ git tag（`v0.1.0` 待打） |
| SEO | title/meta/OG | ✅ 含 og:image（1200×630，几何版）+ twitter:card |
| SEO | favicon | ✅ favicon.svg + apple-touch-icon.png（180×180，PNG CRC 校验过） |
| SEO | robots.txt | ✅ 已加（单页站，sitemap 从略） |
| SEO | GSC 验证 | ⏳ 部署后做（拥有域名后） |
| 分析 | 埋点 | ✅ 有意为零（隐私即卖点；未来可选自托管 Umami） |
| 分析 | Cookie | ✅ 零 |
| 合规 | 隐私声明 | ✅ 页内 + 页脚 |
| 合规 | ICP | ✅ 计划 Cloudflare Pages 海外节点 → N/A |
| 商务 | 支付 | ✅ N/A（v0.1 无支付，决策已记录） |
| 商务 | 支持渠道 | ✅ GitHub issues |

## 判定：**公网 GO** ✅

剩余动作（非阻断）：
1. 建远端仓库（用户网页操作）→ AI 验证后 push → 打 tag `v0.1.0`
2. Cloudflare Pages 连接仓库即部署
3. 部署后：GSC 验证、替换 og-image 为带文字设计版、README demo 截图替换占位
