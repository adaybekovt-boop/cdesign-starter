#!/usr/bin/env node
// cdesign audit — static checks for AI-slop / mobile-perf blockers.
// Plain Node.js, no external deps. Run: node scripts/cdesign-audit.mjs
//
// Scans project source under app/ components/ lib/ hooks/ workers/ and reports
// PASS/FAIL with file:line for each rule. Exits non-zero on any FAIL.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, extname, relative } from "node:path";

const ROOTS = ["app", "components", "lib", "hooks", "workers"];
const SOURCE_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const TSX_EXTS = new Set([".tsx", ".jsx"]);
const CSS_EXTS = new Set([".css"]);
const ALL_EXTS = new Set([...SOURCE_EXTS, ...CSS_EXTS]);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    if (name === "node_modules") continue;
    const p = join(dir, name);
    const stat = statSync(p);
    if (stat.isDirectory()) walk(p, out);
    else if (ALL_EXTS.has(extname(p))) out.push(p);
  }
  return out;
}

const allFiles = ROOTS.flatMap((r) => walk(r));
const findings = [];

function flag(level, rule, file, line, snippet) {
  findings.push({
    level,
    rule,
    file: relative(process.cwd(), file),
    line,
    snippet: snippet.trim().slice(0, 140),
  });
}

const LINE_RULES = [
  {
    id: "h-screen",
    level: "FAIL",
    exts: SOURCE_EXTS,
    test: (l) => /\bh-screen\b/.test(l),
    desc: "h-screen breaks on mobile (URL bar). Use min-h-[100dvh].",
  },
  {
    id: "raw 100vh",
    level: "FAIL",
    exts: ALL_EXTS,
    test: (l) => /\b100vh\b/.test(l) && !/100dvh/.test(l),
    desc: "Raw 100vh breaks on mobile (URL bar). Use 100dvh / min-h-[100dvh].",
  },
  {
    id: "transition: all",
    level: "FAIL",
    exts: ALL_EXTS,
    test: (l) =>
      /transition\s*:\s*all\b/.test(l) || /\btransition-all\b/.test(l),
    desc: "List specific properties instead of transition: all.",
  },
  {
    id: "<img>",
    level: "FAIL",
    exts: SOURCE_EXTS,
    test: (l) => /<img(?=[\s/>])/.test(l),
    desc: "Use next/image instead of raw <img>.",
  },
  {
    id: "key={index}",
    level: "FAIL",
    exts: SOURCE_EXTS,
    test: (l) => /\bkey=\{\s*(i|idx|index)\s*\}/.test(l),
    desc: "Use stable keys (item id / content), not array index.",
  },
  {
    id: "syncTouch: true",
    level: "FAIL",
    exts: SOURCE_EXTS,
    test: (l) => /syncTouch\s*:\s*true/.test(l),
    desc: "Lenis syncTouch: true breaks scroll on iOS. Use false.",
  },
  {
    id: "permanent will-change (className)",
    level: "WARN",
    exts: SOURCE_EXTS,
    test: (l) =>
      /\bwill-change-(transform|opacity|scroll|contents|auto)\b/.test(l),
    desc: "Permanent will-change leaks memory. Use useTemporaryWillChange.",
  },
  {
    id: "permanent will-change (style)",
    level: "WARN",
    exts: SOURCE_EXTS,
    test: (l) => /willChange\s*:\s*['"](?!auto)[^'"]+['"]/.test(l),
    desc: "Permanent willChange in style on reusable components leaks memory.",
  },
  {
    id: "backdrop-blur in components",
    level: "WARN",
    exts: TSX_EXTS,
    test: (l) => /\bbackdrop-blur(-\w+)?\b/.test(l),
    desc: "Raw backdrop-blur in components bypasses device-tier gating.",
  },
  {
    id: "hover-only critical content",
    level: "WARN",
    exts: TSX_EXTS,
    test: (l) =>
      /\bopacity-0\b/.test(l) &&
      /\bhover:opacity-(100|[1-9]\d?)\b/.test(l) &&
      !/\bpointer-events-none\b/.test(l),
    desc: "Hover-only reveal is invisible on touch. Confirm non-critical.",
  },
];

function auditCanvasPerf(file, content) {
  if (!/<Canvas\b/.test(content)) return;
  if (/\bPerformanceMonitor\b/.test(content)) return;
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/<Canvas\b/.test(lines[i])) {
      flag("FAIL", "Canvas without PerformanceMonitor", file, i + 1, lines[i]);
      break;
    }
  }
}

const COMMENT_LINE = /^\s*(\/\/|\*|\/\*)/;

for (const file of allFiles) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");
  const ext = extname(file);

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (COMMENT_LINE.test(ln)) continue;
    for (const rule of LINE_RULES) {
      if (!rule.exts.has(ext)) continue;
      if (rule.test(ln, file)) flag(rule.level, rule.id, file, i + 1, ln);
    }
  }

  if (TSX_EXTS.has(ext)) auditCanvasPerf(file, content);
}

function auditProjectMetadata() {
  const intentPath = join(".cdesign", "INTENT.md");
  const fingerprintPath = join(".cdesign", "FINGERPRINT.json");

  if (existsSync(intentPath)) {
    const intent = readFileSync(intentPath, "utf8");
    const legacyIntent =
      /Selected vibe/i.test(intent) && !intent.includes("## DESIGN_GENOME");
    const requiredSections = [
      "## DESIGN_GENOME",
      "## SIGNATURE_DECISION",
      "## REJECTED_DEFAULT",
      "## FINGERPRINT",
      "## DESIGN_LOCKS",
      "## MOTION_LOCKS",
    ];
    if (legacyIntent) {
      flag(
        "WARN",
        "legacy INTENT compatibility",
        intentPath,
        1,
        "Legacy Selected vibe detected; Edit Mode may infer a provisional genome without rewriting.",
      );
    } else {
      for (const section of requiredSections) {
        if (!intent.includes(section)) {
          flag("FAIL", "v3 INTENT schema", intentPath, 1, "Missing " + section);
        }
      }
    }

    if (!legacyIntent) {
      const globalsPath = join("app", "globals.css");
      if (
        existsSync(globalsPath) &&
        readFileSync(globalsPath, "utf8").includes("CDESIGN_NEUTRAL_TOKENS_REPLACE")
      ) {
        flag(
          "FAIL",
          "neutral starter leakage",
          globalsPath,
          1,
          "Replace neutral starter tokens from DESIGN_GENOME and remove the marker.",
        );
      }

      const pagePath = join("app", "page.tsx");
      if (
        existsSync(pagePath) &&
        readFileSync(pagePath, "utf8").includes("data-cdesign-canvas")
      ) {
        flag(
          "FAIL",
          "neutral starter leakage",
          pagePath,
          1,
          "Replace the neutral generation canvas.",
        );
      }
    }
  }

  if (existsSync(fingerprintPath)) {
    const requiredKeys = [
      "hero_composition",
      "navigation_pattern",
      "typography_pairing_category",
      "palette_strategy",
      "dominant_geometry",
      "section_rhythm",
      "section_sequence",
      "motion_mechanism",
      "imagery_treatment",
      "signature_motif",
    ];
    try {
      const fingerprint = JSON.parse(readFileSync(fingerprintPath, "utf8"));
      for (const key of requiredKeys) {
        if (!(key in fingerprint)) {
          flag("FAIL", "v3 FINGERPRINT schema", fingerprintPath, 1, "Missing " + key);
        }
      }
    } catch (error) {
      flag("FAIL", "v3 FINGERPRINT schema", fingerprintPath, 1, String(error));
    }
  }
}

auditProjectMetadata();

const RULES_CHECKED = [
  ...LINE_RULES.map((r) => ({ id: r.id, level: r.level })),
  { id: "Canvas without PerformanceMonitor", level: "FAIL" },
  { id: "v3 INTENT schema", level: "FAIL" },
  { id: "v3 FINGERPRINT schema", level: "FAIL" },
  { id: "legacy INTENT compatibility", level: "WARN" },
  { id: "neutral starter leakage", level: "FAIL" },
];

const failures = findings.filter((f) => f.level === "FAIL").length;
const warnings = findings.filter((f) => f.level === "WARN").length;

const out = [];
out.push("cdesign audit");
out.push("=============");
out.push("");
out.push(`Scanned: ${allFiles.length} files under ${ROOTS.join(", ")}`);
out.push("");

const byRule = new Map();
for (const f of findings) {
  if (!byRule.has(f.rule)) byRule.set(f.rule, []);
  byRule.get(f.rule).push(f);
}

for (const { id, level } of RULES_CHECKED) {
  const hits = byRule.get(id);
  if (!hits || hits.length === 0) {
    out.push(`PASS  ${id}`);
    continue;
  }
  out.push(`${level}  ${id}  (${hits.length})`);
  for (const f of hits) out.push(`      ${f.file}:${f.line}  ${f.snippet}`);
}

out.push("");
out.push("---");
out.push(`Summary: ${failures} FAIL, ${warnings} WARN`);

console.log(out.join("\n"));

process.exit(failures > 0 ? 1 : 0);
