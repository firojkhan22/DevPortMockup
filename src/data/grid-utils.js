// src/data/grid-utils.js
// Provides (global): useSortState, toggleSort, sortRows, filterMatch, userFullName
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Reusable column-header sort trigger, click to sort ascending, click
// again to reverse, click a different column to switch to it. `sortKey`
// is whatever key `sortRows` below will match against its accessor
// map — pass null/omit for a column that shouldn't be sortable (e.g.
// an actions column).
function useSortState(defaultKey) {
  return useState({ key: defaultKey || null, dir: "asc" });
}
function toggleSort(sort, setSort, key) {
  if (sort.key === key) {
    setSort({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
  } else {
    setSort({ key, dir: "asc" });
  }
}
// `accessors` maps each sortable key to a function pulling the
// comparable value out of a row. Numbers sort numerically, anything
// else falls back to a locale-aware string compare.
function sortRows(rows, sort, accessors) {
  if (!sort.key || !accessors[sort.key]) return rows;
  const accessor = accessors[sort.key];
  const sorted = [...rows].sort((a, b) => {
    const av = accessor(a);
    const bv = accessor(b);
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av).localeCompare(String(bv), undefined, { numeric: true });
  });
  return sort.dir === "desc" ? sorted.reverse() : sorted;
}

// Case-insensitive substring match, tolerant of numbers/undefined —
// the small shared helper every grid's per-column filter uses.
function filterMatch(value, needle) {
  if (!needle) return true;
  return String(value == null ? "" : value)
    .toLowerCase()
    .includes(needle.toLowerCase());
}

// Consistent "First Middle Last" formatting for a user record —
// omits middle name cleanly when there isn't one.
function userFullName(u) {
  if (!u) return "";
  return [u.firstName, u.middleName, u.lastName].filter(Boolean).join(" ");
}
