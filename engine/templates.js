// Grammar template filler with the four allowed shapes from SPEC.md §7.2.
// Templates are JSON-defined patterns with {slot} placeholders. Slots get
// filled from row cells, state values, or computed strings.
//
// Slot syntax:
//   {row.field}            — substitute as string. Arrays join with " · ".
//   {row.field:list}       — array → <li>...</li> items (use inside <ul>).
//   {row.field:join:and}   — array → "a, b, and c" oxford-style.

const SLOT_PATTERN = /\{([a-zA-Z0-9_.]+)(?::([a-zA-Z]+)(?::([a-zA-Z]+))?)?\}/g;

export function fill(template, slots) {
  if (!template) return "";
  return template.replace(SLOT_PATTERN, (_, key, formatter, formatterArg) => {
    const v = resolve(slots, key);
    if (v == null) return `[${key}?]`;
    if (Array.isArray(v)) return formatArray(v, formatter, formatterArg);
    return String(v);
  });
}

function formatArray(arr, formatter, arg) {
  if (formatter === "list") return arr.map((x) => `<li>${escapeHtml(String(x))}</li>`).join("");
  if (formatter === "join" && arg === "and" && arr.length > 1) {
    const head = arr.slice(0, -1).join(", ");
    return `${head}, and ${arr[arr.length - 1]}`;
  }
  return arr.join(" · ");
}

function resolve(slots, dotPath) {
  const parts = dotPath.split(".");
  let cur = slots;
  for (const p of parts) {
    if (cur == null) return null;
    cur = cur[p];
  }
  return cur;
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

export function pickTemplate(templates, shape, predicate = () => true) {
  const candidates = templates.filter((t) => t.shape === shape && predicate(t));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export const ALLOWED_SHAPES = ["question", "case_paired", "next_step_paired", "reframe"];
