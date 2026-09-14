// 引擎测试 —— node:test 内置运行器，零依赖
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { lint } from '../engine/index.js';

const healthyResume = [
  '张三  13800138000  zhangsan@example.com',
  '工作经历',
  '主导订单系统重构，接口响应从 800ms 降至 120ms，支撑日均 50 万单',
  '搭建监控体系，故障定位时间缩短 70%',
  '技能：TypeScript / Go / PostgreSQL',
  '教育背景：某某大学 计算机科学 2016-2020',
  '项目：内部工具平台，服务 300+ 员工，NPS 提升 25%',
].join('\n');

describe('rule: quantification 量化密度', () => {
  it('成果条目量化占比 ≥40% 不报问题', () => {
    const text = [
      '负责订单系统', // 非量化 bullet
      '主导重构，响应从 800ms 降至 120ms',
      '支撑日均 50 万单，错误率下降 65%',
      '优化登录流程，转化率提升 3 个百分点',
      '维护数据管线，月均节省 40 人时',
    ].join('\n');
    const issues = lint(text).issues.filter((i) => i.rule === 'quantification');
    assert.equal(issues.length, 0);
  });

  it('几乎无量化的简历报 warn 并给出占比', () => {
    const text = ['负责订单系统', '参与需求评审', '配合测试上线', '维护日常运维'].join('\n');
    const issue = lint(text).issues.find((i) => i.rule === 'quantification');
    assert.ok(issue);
    assert.equal(issue.severity, 'warn');
    assert.match(issue.message, /量化/);
  });
});

describe('rule: passive-voice 责任词密度', () => {
  it('责任词为主的简历报 warn', () => {
    const text = ['负责订单系统', '参与需求评审', '配合测试上线', '协助排查问题', '跟进迭代'].join('\n');
    const issue = lint(text).issues.find((i) => i.rule === 'passive-voice');
    assert.ok(issue);
    assert.match(issue.message, /负责|参与|配合|被动|责任/);
  });

  it('强动词为主的简历不报', () => {
    const text = ['主导订单系统重构', '搭建监控体系', '设计权限模型', '推动 CI 落地'].join('\n');
    const issues = lint(text).issues.filter((i) => i.rule === 'passive-voice');
    assert.equal(issues.length, 0);
  });
});

describe('rule: buzzwords 套话黑名单', () => {
  it('检出吃苦耐劳/抗压/精通滥用等套话，severity=warn', () => {
    const text = ['精通 Java，精通 SQL，精通前端', '吃苦耐劳，抗压能力强', '执行力强，有狼性'].join('\n');
    const issues = lint(text).issues.filter((i) => i.rule === 'buzzwords');
    assert.ok(issues.length >= 2, `应至少检出 2 类，实际 ${issues.length}`);
    assert.ok(issues.every((i) => i.severity === 'warn'));
  });

  it('正常表达不误报', () => {
    const text = ['熟悉 TypeScript 与 Go', '负责核心模块的稳定性'].join('\n');
    const issues = lint(text).issues.filter((i) => i.rule === 'buzzwords');
    assert.equal(issues.length, 0);
  });
});

describe('rule: sections 关键板块', () => {
  it('缺失板块逐个报 info（教育/工作/技能）', () => {
    const r = lint('张三\n会写一点代码');
    const ids = r.issues.filter((i) => i.rule === 'sections').map((i) => i.missing);
    assert.ok(ids.includes('education'), '缺教育');
    assert.ok(ids.includes('experience'), '缺工作/实习');
    assert.ok(ids.includes('skills'), '缺技能');
  });

  it('板块齐全不报', () => {
    const text = [
      '张三 13800138000 zhangsan@example.com',
      '工作经历：某公司 后端工程师 2020-2024',
      '教育背景：某某大学 计算机 2016-2020',
      '专业技能：TypeScript / Go',
    ].join('\n');
    const issues = lint(text).issues.filter((i) => i.rule === 'sections');
    assert.equal(issues.length, 0);
  });
});

describe('rule: contact 联系方式', () => {
  it('缺邮箱或手机报 warn', () => {
    const r = lint('张三\n工作经历\n主导重构，响应从 800ms 降至 120ms');
    const issue = r.issues.find((i) => i.rule === 'contact');
    assert.ok(issue);
    assert.match(issue.message, /联系方式|邮箱|电话/);
  });

  it('手机+邮箱齐全不报', () => {
    const text = '张三 13800138000 zhangsan@example.com\n主导重构，QPS 提升 3 倍';
    const issues = lint(text).issues.filter((i) => i.rule === 'contact');
    assert.equal(issues.length, 0);
  });
});

describe('rule: privacy 敏感信息', () => {
  it('检出身份证号 → severity=error', () => {
    const text = '张三\n身份证号 110101199003077758\n主导重构，错误率下降 65%';
    const issue = lint(text).issues.find((i) => i.rule === 'privacy');
    assert.ok(issue);
    assert.equal(issue.severity, 'error');
  });

  it('正常简历不误报', () => {
    const issues = lint(healthyResume).issues.filter((i) => i.rule === 'privacy');
    assert.equal(issues.length, 0);
  });
});

describe('rule: bullet-length 长句', () => {
  it('超过 60 字的陈述行报 info', () => {
    const long = '主导订单系统重构' + '，把接口响应时间从 800ms 降到了 120ms'.repeat(3);
    const r = lint(long);
    const issue = r.issues.find((i) => i.rule === 'bullet-length');
    assert.ok(issue);
    assert.equal(issue.severity, 'info');
  });
});

describe('engine: 聚合与边界（SCOPE 验收标准 3/4）', () => {
  it('空输入不崩溃，返回引导性结果', () => {
    const r = lint('');
    assert.ok(r.score >= 0 && r.score <= 100);
    assert.ok(Array.isArray(r.issues));
  });

  it('总分在 0-100，问题严重度降序排列', () => {
    const bad = ['身份证号 110101199003077758', '吃苦耐劳，抗压能力强'].join('\n');
    const r = lint(bad);
    assert.ok(r.score >= 0 && r.score <= 100);
    const sev = { error: 3, warn: 2, info: 1 };
    for (let i = 1; i < r.issues.length; i++) {
      assert.ok(sev[r.issues[i - 1].severity] >= sev[r.issues[i].severity], '应按严重度降序');
    }
  });

  it('健康简历得分显著高于烂简历', () => {
    const good = lint(healthyResume.repeat(4));
    const bad = lint(['身份证号 110101199003077758', '吃苦耐劳，精通 Office，精通 Java', '负责打杂'].join('\n'));
    assert.ok(good.score > bad.score, `good=${good.score} bad=${bad.score}`);
  });
});

describe('rule: length 简历长度', () => {
  it('健康长度（500-1500 字）不报问题', () => {
    const padded = healthyResume.repeat(4);
    // 夹具自检：确保长度确实落在健康区间（防止夹具悄悄失效）
    const len = padded.replace(/\s/g, '').length;
    assert.ok(len >= 500 && len <= 1500, `夹具长度 ${len} 不在 500-1500，请修夹具`);
    const r = lint(padded);
    const issues = r.issues.filter((i) => i.rule === 'length');
    assert.equal(issues.length, 0);
  });

  it('过短简历报 warn 并提示下限', () => {
    const r = lint('张三\n会写代码');
    const issue = r.issues.find((i) => i.rule === 'length');
    assert.ok(issue, '应产出 length issue');
    assert.equal(issue.severity, 'warn');
    assert.match(issue.message, /500|过短/);
  });

  it('校准回归：490 字的精简一页简历不触发 length（下限 500）', () => {
    const text = '主'.repeat(490); // 边界下侧
    const below = lint(text).issues.some((i) => i.rule === 'length');
    assert.ok(below, '490 字应仍报过短');
    const ok = lint('主'.repeat(510));
    assert.equal(ok.issues.filter((i) => i.rule === 'length').length, 0, '510 字不应报');
  });
});
