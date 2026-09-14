# resume-lint

> 简历体检器——3 分钟查出你的简历会被初筛卡在哪。**纯浏览器本地运行，简历一个字节都不上传。**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![tests](https://img.shields.io/badge/tests-19%2F19-brightgreen)](README.zh-CN.md#贡献)

![](og-image.png)

[English](README.md) · 中文

## 为什么

简历投出去石沉大海，你不知道问题出在简历还是岗位。在线工具要你上传简历——
手机号、经历、教育背景从此存在别人的服务器上。

resume-lint 把检查做成 lint：**断网也能跑，引擎开源可审计**。

## Quick start（30 秒）

```bash
git clone https://github.com/ikoobee/resume-lint && cd resume-lint
npx serve .        # 或任意静态服务器；直接双击 index.html 也可以
```

粘贴简历全文 → 点「开始体检」→ 得到 0-100 分与问题清单。

也可以只用作库：

```js
import { lint } from './engine/index.js';
const { score, issues } = lint(resumeText);
```

## 检查的 8 项规则

| 规则 | 查什么 | 级别 |
|---|---|---|
| privacy | 身份证号/完整生日/户籍/政治面貌——外企合规红线 | ⛔ error |
| length | 过短（<500 字）撑不起说服力 / 过长（>1500 字） | ⚠️ |
| quantification | 成果描述的量化占比（建议 ≥40%） | ⚠️ |
| passive-voice | 「负责/参与/配合」多于「主导/搭建/设计」——像职责不像战绩 | ⚠️ |
| buzzwords | 吃苦耐劳/抗压能力强/精通连用/互联网黑话 | ⚠️ |
| contact | 手机/邮箱缺失 | ⚠️ |
| sections | 教育/工作/技能板块缺失 | 💡 |
| bullet-length | 超 60 字长句 | 💡 |

规则是纯函数（`(text) => issues[]`），欢迎加规则：fork → `engine/rules.js` 加一个导出 → 带 2 个单测（正/反）→ PR。

## 与同类工具的差异

| | resume-lint | 在线简历工具（Jobscan/超级简历等） |
|---|---|---|
| 简历数据 | **不出浏览器** | 上传服务器 |
| 价格 | 基础检查永久免费 | 订阅 $49/月 或会员 |
| 形态 | 开源引擎 + 静态页 | 账号制 SaaS |

## Roadmap

- [ ] .txt / .md 文件拖入
- [ ] 英文简历规则集
- [ ] CLI（`npx resume-lint resume.txt`）
- [ ] 详细改写报告（付费层，基础检查永不收费）

## 贡献

欢迎 PR，尤其是带测试的新规则。提交前请跑 `npm test`（预期 19/19 全绿）。

## License

MIT
