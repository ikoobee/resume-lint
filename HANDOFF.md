# HANDOFF —— resume-lint
> 更新时间：2026-09-15 · 会话主题：indie-dev-skills 体系端到端测试

## 现在在哪（一句话）
v0.1.0 本地完成：8 条规则 + 单页 UI + 18/18 测试全绿，待部署公网。

## 已完成（本会话）
- [x] 验证/战略/范围三件套：`docs/VALIDATION.md` `docs/STRATEGY.md` `SCOPE.md`
- [x] 引擎 8 规则 TDD 实现（3 轮 Red-Green），`node --test` 18/18
- [x] UI：令牌化样式 + landing 结构 + 空态/焦点态
- [x] QA/ShipCheck 报告（`docs/QA-REPORT.md` `docs/SHIP-CHECK.md`）
- [x] README（oss-readme 规范）

## 进行中（未完成）
- 无半成品；下一步全部未开工

## 下一步（按优先级）
1. **部署**：Cloudflare Pages（免备案）——补 favicon 后 push（补完 SHIP-CHECK 部署前待办）
2. **真实简历校准**：拿 5-10 份真实简历跑一遍，调规则阈值（600 字下限可能偏严）
3. **waitlist 冒烟**（VALIDATION.md 阶段 2 欠账）：V2EX/小红书发「开发故事」帖看转化
4. 发布序列（`/oss-launch`）：Show HN（英文 README 需先写）→ V2EX 分享创造
5. 有留存后接支付：虎皮椒 ¥9.9 + Polar $1.99（决策见 STRATEGY.md）

## 关键决策记录
- 选 MIT 而非 AGPL：目标是传播与信任，付费价值在内容不在代码闭源
- 零依赖（node --test 内置）：供应链风险为零，部署成本为零
- 分析埋点有意为零：隐私即卖点，与增长需求冲突时隐私优先
- v1 只支持粘贴文本：PDF 解析易碎，推迟到 v1.1

## 环境与注意事项
- 测试命令：`npm test`（= `node --test`，Windows 下勿写 `tests/` 尾斜杠会路径错误）
- 无 node_modules、无锁文件——保持零依赖是产品特性
- docs/demo.png 是 README 占位，部署前截真图替换

## 本次会话对 skills 体系的测试发现（回填 indie-dev-skills）
1. install.ps1 需 UTF-8 BOM（Windows PowerShell 5.1 GBK 解析错误）——已修复并回仓库
2. tdd-workflow「检查点纪律」真实拦住了我一次（未验 Green 先 commit）——规则有效
3. Windows `node --test tests/` 尾斜杠坑——已记入 HANDOFF 环境注意事项
4. ship-check 静态站场景大量 N/A——报告里明确区分「本地 GO / 公网 NO-GO」很有用
