// src/components/common/GridControls.jsx
// Provides (global): GridFilterRow, SortableTh
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Reusable per-column "filter as you type" row, dropped directly
// under a table's header row so grids filter instantly without a
// separate search step. `columns` is an array matching the header's
// column count 1:1 — pass null for columns that shouldn't get a
// filter input (e.g. action/button columns), or
// { value, onChange, placeholder } for ones that should.
function GridFilterRow({ columns }) {
  return (
    <tr className="grid-filter-row">
      {columns.map((c, i) => (
        <td key={i} className="py-1">
          {c && c.custom ? (
            c.custom
          ) : (
            c && (
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder={c.placeholder || "Filter…"}
                value={c.value}
                onChange={(e) => c.onChange(e.target.value)}
              />
            )
          )}
        </td>
      ))}
    </tr>
  );
}
function SortableTh({ label, sortKey, sort, onSort, style }) {
  const active = sortKey && sort.key === sortKey;
  return (
    <th
      style={{
        cursor: sortKey ? "pointer" : "default",
        userSelect: "none",
        whiteSpace: "nowrap",
        ...style,
      }}
      onClick={() => sortKey && onSort(sortKey)}
    >
      {label}
      {active && (sort.dir === "asc" ? " ▲" : " ▼")}
    </th>
  );
}
