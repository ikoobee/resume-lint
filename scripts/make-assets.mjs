// 图标与 OG 图生成器 —— 零依赖（node:zlib + 手写 PNG 编码器）
// 用法：node scripts/make-assets.mjs
// 设计母题：lint 报告（横杠条）+ 体检绿；文字类资产请后续用设计工具替换
import { deflateSync, crc32 } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('icons', { recursive: true });

// ── 极简 PNG 编码器（RGBA8，filter 0） ──────────────────────
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body) >>> 0);
  return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8bit RGBA
  // 每行前置 filter byte 0
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

// ── 画布：像素级绘制 ─────────────────────────────────────────
function canvas(w, h, bg) {
  const px = Buffer.alloc(w * h * 4);
  const set = (x, y, [r, g, b, a = 255]) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 4;
    const sa = a / 255, da = px[i + 3] / 255, oa = sa + da * (1 - sa);
    if (oa === 0) return;
    px[i] = (r * sa + px[i] * da * (1 - sa)) / oa;
    px[i + 1] = (g * sa + px[i + 1] * da * (1 - sa)) / oa;
    px[i + 2] = (b * sa + px[i + 2] * da * (1 - sa)) / oa;
    px[i + 3] = oa * 255;
  };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) set(x, y, bg);
  const rect = (x0, y0, rw, rh, color, radius = 0) => {
    for (let y = y0; y < y0 + rh; y++) for (let x = x0; x < x0 + rw; x++) {
      if (radius > 0) {
        // 四角圆角检测
        const cx = x < x0 + radius ? x0 + radius : x > x0 + rw - 1 - radius ? x0 + rw - 1 - radius : x;
        const cy = y < y0 + radius ? y0 + radius : y > y0 + rh - 1 - radius ? y0 + rh - 1 - radius : y;
        if ((x - cx) ** 2 + (y - cy) ** 2 > radius * radius) continue;
      }
      set(x, y, color);
    }
  };
  return { px, rect, w, h };
}

const GREEN = [5, 150, 105, 255];       // --primary-500 #059669
const DARK = [17, 24, 39, 255];         // --gray-900 #111827
const WHITE = [255, 255, 255, 255];
const GRAY300 = [209, 213, 219, 255];

// ── apple-touch-icon：绿底圆角 + 三条白色报告杠 ─────────────
{
  const S = 180, { px, rect } = canvas(S, S, [0, 0, 0, 0]);
  rect(0, 0, S, S, GREEN, 36);
  const bars = [[54, 52, 72], [54, 82, 96], [54, 112, 56]]; // x, y, 宽
  for (const [x, y, w] of bars) rect(x, y, w, 14, WHITE, 7);
  writeFileSync('icons/apple-touch-icon.png', encodePNG(S, S, px));
}

// ── og-image：深底 + 报告杠 + 绿色对勾圆 ────────────────────
{
  const W = 1200, H = 630, { px, rect } = canvas(W, H, DARK);
  // 左侧：模拟体检报告行
  const rows = [96, 172, 248, 324, 400];
  rows.forEach((y, i) => {
    rect(96, y, i === 1 ? 520 : 340 + (i % 3) * 90, 36, i === 0 ? GRAY300 : [75, 85, 99, 255], 18);
  });
  // 右侧：绿色圆 + 白色对勾（两段矩形拼）
  const cx = 920, cy = 315, R = 130;
  rect(cx - R, cy - R, R * 2, R * 2, GREEN, R);
  // 勾：短杠（旋转近似为阶梯矩形）+ 长杠，用小方块沿路径铺
  const check = (x0, y0, x1, y1, t) => {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let s = 0; s <= steps; s++) {
      const x = Math.round(x0 + (x1 - x0) * (s / steps));
      const y = Math.round(y0 + (y1 - y0) * (s / steps));
      rect(x - t, y - t, t * 2, t * 2, WHITE);
    }
  };
  check(cx - 55, cy + 5, cx - 12, cy + 48, 11);
  check(cx - 12, cy + 48, cx + 58, cy - 42, 11);
  writeFileSync('og-image.png', encodePNG(W, H, px));
}

console.log('✓ icons/apple-touch-icon.png (180×180)');
console.log('✓ og-image.png (1200×630)');
console.log('注意：OG 为几何占位设计，正式发布前建议用带文字的设计版替换。');
