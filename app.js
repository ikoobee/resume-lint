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

// ── v0.2：.txt / .md 文件拖入与选择（FileReader，本地读取，无上传） ──
const SUPPORTED_EXT = ['.txt', '.md', '.markdown'];

function isSupportedFile(name) {
  const lower = name.toLowerCase();
  return SUPPORTED_EXT.some((ext) => lower.endsWith(ext));
}

function readFileIntoInput(file) {
  if (!isSupportedFile(file.name)) {
    alert(`目前支持粘贴文本或拖入 ${SUPPORTED_EXT.join(' / ')} 文件（PDF 解析在路上）`);
    return;
  }
  if (file.size > 1024 * 1024) {
    alert('文件超过 1MB——看起来不像简历文本，请检查是否拖错文件');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    input.value = String(reader.result || '').trim();
    runBtn.focus();
  };
  reader.onerror = () => alert('文件读取失败，请重试或直接粘贴文本');
  reader.readAsText(file); // 本地读取，无网络请求
}

const dropZone = input;
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  if (e.dataTransfer?.files?.[0]) readFileIntoInput(e.dataTransfer.files[0]);
});

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.txt,.md,.markdown';
fileInput.hidden = true;
fileInput.addEventListener('change', () => fileInput.files[0] && readFileIntoInput(fileInput.files[0]));
document.body.appendChild(fileInput);

const fileBtn = document.createElement('button');
fileBtn.type = 'button';
fileBtn.id = 'file-btn';
fileBtn.textContent = '或选择 .txt / .md 文件';
fileBtn.addEventListener('click', () => fileInput.click());
runBtn.insertAdjacentElement('afterend', fileBtn);
