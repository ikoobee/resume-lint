# QA 报告 —— resume-lint v0.1.0（2026-09-15）

> 由 `/pre-release-qa` + `/dep-audit` 产出（静态站适用版）

## 自动化测试

- `node --test`：**18 通过 / 0 失败**
- 覆盖：8 条规则各有正/反用例 + 引擎聚合（空输入、分数边界、严重度排序、好坏对照）

## 关键路径冒烟

| 场景 | 结果 |
|---|---|
| 烂简历样本（敏感信息+套话+责任词+无量化） | score 0，7 类问题全检出 ✓ |
| 健康简历样本 | score 88，仅 length（样本本身 <600 字，符合预期）✓ |
| 空输入 | 引导提示，不崩溃 ✓（有单测） |
| JS 语法 | app.js / engine 全部通过 `node --check` ✓ |
| 静态资源 | tokens.css / app.css / app.js 引用齐全 ✓ |

## 支付沙箱

N/A——v0.1 未集成支付（见 STRATEGY.md：免费版有留存后再上）。

## 跨端与可访问性

- 移动端：480px 断点已做（CTA 全宽、字号降档）⚠️ 未真机验证
- 焦点态：textarea `:focus-visible` 2px 主色描边 ✓
- Lighthouse：**未运行**（无本地浏览器自动化环境）→ 部署后补

## 依赖审计（dep-audit）

- dependencies / devDependencies 均为空，无 node_modules、无锁文件 → **供应链风险为零**
- License：本项目 MIT，无第三方代码引入

## 未验证项（如实）

1. 真实浏览器 E2E（Playwright）——环境无浏览器，部署后补
2. Lighthouse 分数
3. 真机移动端体验

## 判定：**GO**（v0.1 作为本地可运行版本；线上发布前需补 SEO 三件套，见 SHIP-CHECK.md）
