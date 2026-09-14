# Show HN 发帖草稿

> 按 `/oss-launch` → references/hacker-news.md 模板。
> 时机：周二~周四美东早 8-10 点（北京时间 21-23 点）。
> 英文 README 必须先行（已完成）。每条评论必回。

---

**标题**：

```
Show HN: Resume-lint – Check your resume locally, it never leaves your browser
```

**首评（maker comment）**：

Maker here. Try it: https://resume-lint.ikoobee.com (open DevTools — the network tab
stays empty after the page loads; that's the whole point).

Background: I kept sending out resumes and hearing nothing back, and
I couldn't tell whether the problem was my resume or the market. Every online
checker I found wanted me to upload my resume to their server first — phone
number, full work history, education, everything.

So I built the opposite of that: a static page with an open-source rules engine
that runs entirely in the browser. Paste your resume, get a 0-100 score and a
prioritized issue list. Works offline. Zero cookies, zero requests after load
(open DevTools and watch the network tab stay empty).

Technical choices:
- Zero dependencies. The engine is 8 pure functions `(text) => issues[]` —
  plain ES modules, tested with node's built-in test runner (19 tests)
- The whole site is static files, so it deploys anywhere for free and can't
  leak your data because there's no backend to leak it
- Rules are regex/heuristic-based, deliberately not AI — sending your resume
  to an LLM is just uploading it with extra steps

Honest limitations:
- Text paste only for now (PDF drag-and-drop is next)
- Thresholds are tuned for Chinese resumes; an English rule set is on the
  roadmap — which is also where contributions would help most, each rule is
  ~20 lines plus two tests

Would genuinely like feedback from people who hire: which checks would you
add?

---

**评论应对要点**：
- 「regex 简历检查太玩具」→ 承认启发式的局限，强调 0 隐私成本换 80% 常见问题
- 「为什么不开源 CLI」→ roadmap 第三项，欢迎 PR
- 被问商业模式 → 坦白：基础永久免费，详细改写报告可能收费
