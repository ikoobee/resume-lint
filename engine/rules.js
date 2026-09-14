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

export const rules = [lengthRule, quantificationRule, passiveVoiceRule, buzzwordsRule];

// ── rule: quantification ─────────────────────────────────────
// 成果类 bullet 中含量化（数字/%/倍数）的占比，≥40% 健康
const NUMBER_RE = /\d+\s*(%|％|万|亿|k|K|m|M|倍|个点|人时|ms|s|qps|QPS)?|[%％]/;

function bulletLines(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length >= 5); // 近似 bullet：排除标题/短标签行
}

export function quantificationRule(text) {
  const lines = bulletLines(text);
  if (lines.length < 3) return []; // 样本太少，不判
  const quantified = lines.filter((l) => NUMBER_RE.test(l)).length;
  const ratio = quantified / lines.length;
  if (ratio < 0.4) {
    return [{
      rule: 'quantification',
      severity: 'warn',
      message: `成果描述的量化占比仅 ${Math.round(ratio * 100)}%（建议 ≥40%）——没有数字的经历很难被记住`,
      hint: '给核心成果补数据：性能变化、规模（日活/单量）、效率收益（人时/周期）',
    }];
  }
  return [];
}

// ── rule: passive-voice ──────────────────────────────────────
// 责任词（负责/参与/配合/协助/跟进/支持）vs 强动词（主导/搭建/设计/实现/推动/重构）
const PASSIVE_WORDS = ['负责', '参与', '配合', '协助', '跟进', '支持', '帮忙', '从事'];
const STRONG_WORDS = ['主导', '搭建', '设计', '实现', '推动', '重构', '创立', '优化', '落地', '解决', '构建', '制定'];

export function passiveVoiceRule(text) {
  let passive = 0;
  let strong = 0;
  for (const w of PASSIVE_WORDS) passive += (text.split(w).length - 1);
  for (const w of STRONG_WORDS) strong += (text.split(w).length - 1);
  const total = passive + strong;
  if (total < 3) return []; // 样本太少
  if (passive > strong) {
    return [{
      rule: 'passive-voice',
      severity: 'warn',
      message: `责任型动词（负责/参与/配合…）出现 ${passive} 次，多于成果型动词（主导/搭建/设计…）${strong} 次——读起来像岗位职责而不是战绩`,
      hint: '把「负责 X」改写为「主导 X，达成 Y」：责任词 + 结果数据',
    }];
  }
  return [];
}

// ── rule: buzzwords ──────────────────────────────────────────
// 套话黑名单：自我标榜类 & 滥用类
const BUZZWORD_PATTERNS = [
  { re: /精通[^\n，。,]{0,12}[，,\n][^\n]*精通|(?:精通[^\n，。,]*[，,。.\n]){2,}/, label: '「精通」连用' },
  { re: /吃苦耐劳|抗压能力强|任劳任怨/, label: '「吃苦耐劳/抗压能力强」' },
  { re: /执行力强|狼性|结果导向|闭环思维|赋能|抓手/, label: '互联网黑话' },
  { re: /精通\s*(office|Office|办公软件)/, label: '「精通 Office」' },
];

export function buzzwordsRule(text) {
  const issues = [];
  const seen = new Set();
  for (const p of BUZZWORD_PATTERNS) {
    if (p.re.test(text) && !seen.has(p.label)) {
      seen.add(p.label);
      issues.push({
        rule: 'buzzwords',
        severity: 'warn',
        message: `检出套话：${p.label}——初筛者每天看几百份这类词，已免疫`,
        hint: '删掉自我评价，用一条带数字的事实替代（「精通 SQL」→「为 40 张核心表写了慢查询治理方案，P99 降 80%」）',
      });
    }
  }
  return issues;
}
