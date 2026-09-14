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

describe('rule: length 简历长度', () => {
  it('健康长度（600-1500 字）不报问题', () => {
    const r = lint(healthyResume.repeat(2)); // 拉长到区间内
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
