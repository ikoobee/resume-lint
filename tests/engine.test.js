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

describe('rule: length 简历长度', () => {
  it('健康长度（600-1500 字）不报问题', () => {
    const padded = healthyResume.repeat(4);
    // 夹具自检：确保长度确实落在健康区间（防止夹具悄悄失效）
    const len = padded.replace(/\s/g, '').length;
    assert.ok(len >= 600 && len <= 1500, `夹具长度 ${len} 不在 600-1500，请修夹具`);
    const r = lint(padded);
    const issues = r.issues.filter((i) => i.rule === 'length');
    assert.equal(issues.length, 0);
  });

  it('过短简历报 warn 并提示下限', () => {
    const r = lint('张三\n会写代码');
    const issue = r.issues.find((i) => i.rule === 'length');
    assert.ok(issue, '应产出 length issue');
    assert.equal(issue.severity, 'warn');
    assert.match(issue.message, /600|过短|太少/);
  });
});
