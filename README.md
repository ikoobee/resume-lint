# resume-lint

> Lint your resume before a recruiter does. **Runs 100% in your browser — your resume never leaves your machine.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE) [![tests](https://img.shields.io/badge/tests-19%2F19-brightgreen)](#contributing)

![](og-image.png)

## Why

You send out resumes and hear nothing back. You don't know if the problem is the job market or your resume — and every online checker wants you to **upload your resume to their server first** (phone number, work history, education and all).

resume-lint treats your resume like code: paste it, get a report. **Works offline. Open source. Auditable.**

## Quick start (30 seconds)

```bash
git clone https://github.com/ikoobee/resume-lint && cd resume-lint
npx serve .        # or any static server — opening index.html directly also works
```

Paste your resume text → hit the button → get a 0-100 score with an issue list.

Or use the engine as a library:

```js
import { lint } from './engine/index.js';
const { score, issues } = lint(resumeText);
```

## The 8 rules

| Rule | What it catches | Severity |
|---|---|---|
| privacy | National ID / full birth date / household registration — compliance red flags | ⛔ error |
| length | Too thin (<500 chars) / too long (>1500) | ⚠️ |
| quantification | <40% of bullets contain numbers, percentages, scale | ⚠️ |
| passive-voice | More "responsible for / assisted with" than "led / built / designed" — reads like a job description, not achievements | ⚠️ |
| buzzwords | Cliché self-evaluations and buzzword soup | ⚠️ |
| contact | Missing phone or email | ⚠️ |
| sections | Missing education / experience / skills sections | 💡 |
| bullet-length | Bullets over 60 chars that nobody finishes reading | 💡 |

Rules are pure functions (`(text) => issues[]`). Adding one is welcome: fork → export a rule in `engine/rules.js` → include a positive and a negative test → PR.

## How it differs

| | resume-lint | Online resume tools |
|---|---|---|
| Your data | **Never leaves the browser** | Uploaded to a server |
| Price | Basic checks free forever | $49/mo subscriptions |
| Shape | Open-source engine + static page | Account-based SaaS |

Currently tuned for Chinese resumes; an English rule set is on the roadmap.

## Roadmap

- [ ] .txt / .md file drop
- [ ] English resume rule set
- [ ] CLI (`npx resume-lint resume.txt`)
- [ ] Detailed rewrite report (paid tier — basic checks stay free, forever)

## Contributing

PRs welcome, especially new rules with tests. Run `npm test` (19/19 expected) before submitting.

## License

MIT
