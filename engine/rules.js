// 规则集 —— 每条规则是纯函数：(text, meta) => Issue[]，可独立单测
// Issue: { rule, severity: 'error'|'warn'|'info', message, hint? }

const SEVERITY = { error: 3, warn: 2, info: 1 };
export { SEVERITY };

// ── rule: length ─────────────────────────────────────────────
// 中文简历健康区间 600-1500 字（去空白）
export function lengthRule(text) {
  const len = text.replace(/\s/g, '').length;
  const issues = [];
  if (len < 600) {
    issues.push({
      rule: 'length',
      severity: 'warn',
      message: `简历内容过短（约 ${len} 字）——低于 600 字通常撑不起经历的说服力`,
      hint: '每段经历用 3-5 条成果描述补足，写「做了什么+效果数据」',
    });
  } else if (len > 1500) {
    issues.push({
      rule: 'length',
      severity: 'warn',
      message: `简历内容过长（约 ${len} 字）——超过 1500 字，初筛阅读耐心有限`,
      hint: '砍掉 3 年以前的非相关经历，每条 bullet 控制在 60 字内',
    });
  }
  return issues;
}

export const rules = [lengthRule];
