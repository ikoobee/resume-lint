# Ship Check —— resume-lint v0.1.0（2026-09-15）

> 由 `/ship-check` 五维清单产出。⚠️ 本报告针对**本地开发完成态**；
> 「部署到公网」前需按下表「部署前待办」补齐后再终检一次。

| 维度 | 项 | 状态 |
|---|---|---|
| 技术 | 环境变量 | ✅ N/A（纯静态，无后端无密钥） |
| 技术 | 错误处理 | ✅ 空输入引导态；全局错误兜底 N/A（无服务端） |
| 技术 | 限流/安全 headers | ✅ N/A（无 API；部署时由托管商加 HTTPS+headers） |
| 技术 | 回滚 | ✅ git tag 即回滚点 |
| SEO | title/meta/OG | ✅ 已写（含 og:title/description/type） |
| SEO | favicon | ❌ 缺失 → **部署前待办** |
| SEO | sitemap/robots | ❌ 缺失（单页站影响小）→ 部署前待办（可选） |
| SEO | GSC 验证 | ⏳ 部署后做 |
| 分析 | 埋点 | ✅ **有意为零**——隐私即卖点；未来若需要用自托管 Umami，不用 GA |
| 分析 | Cookie | ✅ 零 Cookie（页脚已声明） |
| 合规 | 隐私声明 | ✅ 「简历不离开浏览器」为核心文案 + 页脚声明 |
| 合规 | ICP | ⏳ 若部署 Cloudflare Pages 海外节点则 N/A；国内节点需备案 |
| 商务 | 支付链路 | ✅ N/A（v0.1 无支付；决策见 STRATEGY.md：虎皮椒 ¥9.9 + Polar $1.99） |
| 商务 | 支持渠道 | ✅ GitHub issues（README 有入口） |

## 判定：本地 GO / 公网 NO-GO（差 favicon 一项 + 部署动作）

## 部署前待办

1. favicon（apple-touch-icon 一并）
2. 选托管：Cloudflare Pages（免备案、免费、国内可达性尚可）→ push 即部署
3. OG image（1200×630，可用页面截图）
4. （可选）robots.txt 一行 `User-agent: * Allow: /`
