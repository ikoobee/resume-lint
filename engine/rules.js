// 规则集 —— 每条规则是纯函数：(text, meta) => Issue[]，可独立单测
// Issue: { rule, severity: 'error'|'warn'|'info', message, hint? }

const SEVERITY = { error: 3, warn: 2, info: 1 };
export { SEVERITY };

// ── rule: length ─────────────────────────────────────────────
// 中文简历健康区间 500-1500 字（去空白）
// 校准 2026-09-15：下限从 600 放宽到 500——一页精简简历（校招/转岗）常在 500-800 字
export function lengthRule(text) {
  const len = text.replace(/\s/g, '').length;
  const issues = [];
  if (len < 500) {
    issues.push({
      rule: 'length',
      severity: 'warn',
      message: `简历内容过短（约 ${len} 字）——低于 500 字通常撑不起经历的说服力`,
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

export const rules = [lengthRule, quantificationRule, passiveVoiceRule, buzzwordsRule, sectionsRule, contactRule, privacyRule, bulletLengthRule];

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

// ── rule: sections ───────────────────────────────────────────
// 关键板块存在性（标题行近似匹配）
const SECTION_DEFS = [
  { key: 'experience', label: '工作/实习经历', re: /(工作经历|实习经历|工作经历|职业经历|实习|工作)/ },
  { key: 'education', label: '教育背景', re: /(教育|学历|院校|毕业|大学|本科|硕士|博士)/ },
  { key: 'skills', label: '专业技能', re: /(技能|技术栈|技术能力|专业能力)/ },
];

export function sectionsRule(text) {
  const issues = [];
  for (const s of SECTION_DEFS) {
    if (!s.re.test(text)) {
      issues.push({
        rule: 'sections',
        severity: 'info',
        missing: s.key,
        message: `缺少「${s.label}」板块——初筛 10 秒内找不到关键信息就会跳过`,
        hint: `补一个独立的「${s.label}」标题段`,
      });
    }
  }
  return issues;
}

// ── rule: contact ────────────────────────────────────────────
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /1[3-9]\d{9}|(?:\+?86[-\s]?)?1[3-9]\d{9}/;

export function contactRule(text) {
  const hasEmail = EMAIL_RE.test(text);
  const hasPhone = PHONE_RE.test(text);
  if (hasEmail && hasPhone) return [];
  const missing = [];
  if (!hasPhone) missing.push('手机号');
  if (!hasEmail) missing.push('邮箱');
  return [{
    rule: 'contact',
    severity: 'warn',
    message: `联系方式缺失：${missing.join('、')}——HR 想约你却找不到入口`,
    hint: '顶部放手机 + 常用邮箱（投外企建议 Gmail/Outlook）',
  }];
}

// ── rule: privacy ────────────────────────────────────────────
// 简历不该出现的敏感信息（泄露风险 + 外企合规直接拒）
const PRIVACY_PATTERNS = [
  { re: /\d{6}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]/, label: '身份证号' },
  { re: /(?:出生日期|生日|出生年月)\s*[:：]?\s*(19|20)\d{2}[年.\-/ ]/, label: '完整出生日期' },
  { re: /(?:户籍|户口|籍贯)\s*[:：]/, label: '户籍信息' },
  { re: /(?:政治面貌|党员|团员)\s*[:：]/, label: '政治面貌（非必需岗位）' },
];

export function privacyRule(text) {
  const issues = [];
  const seen = new Set();
  for (const p of PRIVACY_PATTERNS) {
    if (p.re.test(text) && !seen.has(p.label)) {
      seen.add(p.label);
      issues.push({
        rule: 'privacy',
        severity: 'error',
        message: `简历含敏感信息：${p.label}——隐私泄露风险，且外企 ATS 场景属合规红线`,
        hint: '删除。联系方式之外的个人敏感信息对求职几乎无增益',
      });
    }
  }
  return issues;
}

// ── rule: bullet-length ──────────────────────────────────────
export function bulletLengthRule(text) {
  const issues = [];
  for (const line of bulletLines(text)) {
    if (line.length > 60) {
      issues.push({
        rule: 'bullet-length',
        severity: 'info',
        message: `有超过 60 字的长句（${line.length} 字）——初筛者只读每条前半句`,
        hint: '拆成两条：一条动作 + 一条结果',
      });
      break; // 一条足矣，避免刷屏
    }
  }
  return issues;
}
