/**
 * PostCSS plugin: replace oklch(), color(), and "in oklab" with hex/srgb
 * to avoid "Attempting to parse an unsupported color function" (LightningCSS/Webpack).
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { parse, formatHex } = require("culori");

function oklchToHex(value) {
  try {
    const normalized = value
      .trim()
      .replace(/(\d+(?:\.\d+)?)\s*%/g, (_, n) => `${Number(n) / 100} `);
    const color = parse(`oklch(${normalized})`);
    if (color) return formatHex(color);
  } catch {
    // ignore
  }
  return null;
}

/** Convert CSS color(...) to hex. */
function colorFuncToHex(inner) {
  try {
    const s = inner.trim();
    if (!s) return null;
    const color = parse(`color(${s})`);
    if (color) return formatHex(color);
  } catch {
    // ignore
  }
  return null;
}

/** Find matching closing paren; start is index of '('. Returns -1 if not found. */
function findMatchingParen(str, start) {
  if (str[start] !== "(") return -1;
  let depth = 1;
  for (let i = start + 1; i < str.length; i++) {
    if (str[i] === "(") depth++;
    else if (str[i] === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function replaceOklchInValue(value) {
  if (!value || !value.includes("oklch(")) return value;
  return value.replace(/oklch\(([^)]+)\)/g, (_, inner) => {
    const hex = oklchToHex(inner.trim());
    return hex != null ? hex : `oklch(${inner})`;
  });
}

function replaceOklabInValue(value) {
  if (!value || !value.includes("in oklab")) return value;
  return value.replace(/in oklab\b/g, "in srgb");
}

/** Replace all color(...) with hex; supports nested parens inside color(). */
function replaceColorFuncInValue(value) {
  if (!value || typeof value !== "string") return value;
  let out = value;
  let idx;
  while ((idx = out.indexOf("color(")) !== -1) {
    const open = idx + 6; // after "color("
    const close = findMatchingParen(out, idx + 5); // "color(" -> index of "(" is idx+5
    if (close === -1) break;
    const inner = out.slice(open, close);
    const hex = colorFuncToHex(inner);
    out = out.slice(0, idx) + (hex != null ? hex : out.slice(idx, close + 1)) + out.slice(close + 1);
  }
  return out;
}

function processValue(value) {
  if (!value) return value;
  let v = replaceOklabInValue(value);
  v = replaceOklchInValue(v);
  v = replaceColorFuncInValue(v);
  return v;
}

module.exports = function postcssOklchToHex() {
  return {
    postcssPlugin: "postcss-oklch-to-hex",
    Once(root) {
      root.walkDecls((decl) => {
        if (decl.value) decl.value = processValue(decl.value);
      });
      root.walkAtRules((atRule) => {
        if (atRule.params) atRule.params = processValue(atRule.params);
      });
    },
  };
};
module.exports.postcss = true;
