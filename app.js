// UI 接线 —— 引擎 import 自 engine/，浏览器本地执行（SCOPE 验收标准 1：无网络请求）
import { lint } from './engine/index.js';

const input = document.getElementById('resume-input');
const runBtn = document.getElementById('run-btn');
const result = document.getElementById('result');
const scoreEl = document.getElementById('score');
const issuesEl = document.getElementById('issues');
const allClear = document.getElementById('all-clear');

const SEV_LABEL = { error: '⛔ 必改', warn: '⚠️ 建议改', info: '💡 可优化' };

runBtn.addEventListener('click', () => {
  const text = input.value.trim();

  // 空输入态：引导而非报错（/ui-ux-design 六态）
  if (!text) {
    result.hidden = false;
    scoreEl.textContent = '--';
    scoreEl.className = 'score';
    issuesEl.innerHTML = '<li data-sev="info"><p class="msg">还没有内容</p><p class="hint">把简历全文粘贴到上面输入框，再点「开始体检」。</p></li>';
    allClear.hidden = true;
    return;
  }

  const { score, issues } = lint(text);

  result.hidden = false;
  scoreEl.textContent = score;
  scoreEl.className = 'score' + (score < 50 ? ' danger' : score < 75 ? ' warn' : '');
  allClear.hidden = issues.length > 0;

  issuesEl.innerHTML = issues
    .map(
      (i) => `<li data-sev="${i.severity}">
        <p class="msg">${SEV_LABEL[i.severity]} · ${escapeHtml(i.message)}</p>
        ${i.hint ? `<p class="hint">→ ${escapeHtml(i.hint)}</p>` : ''}
      </li>`,
    )
    .join('');
});

// 文本插入前转义（issue message 含用户不可控内容除外，防御性处理）
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
