// resume-lint engine —— 聚合规则、计算总分（纯函数，浏览器/Node 双端可用）
import { rules, SEVERITY } from './rules.js';

/**
 * @param {string} text 简历纯文本
 * @returns {{ score:number, issues:Array, stats:object }}
 */
export function lint(text) {
  const issues = [];
  for (const rule of rules) issues.push(...rule(text));

  let score = 100;
  for (const i of issues) score -= SEVERITY[i.severity] * 6;

  return {
    score: Math.max(0, Math.min(100, score)),
    issues: issues.sort((a, b) => SEVERITY[b.severity] - SEVERITY[a.severity]),
    stats: { chars: text.replace(/\s/g, '').length, ruleCount: rules.length },
  };
}
