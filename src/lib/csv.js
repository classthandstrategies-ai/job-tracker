// CSV export. RFC-4180 style quoting so commas, quotes, and newlines inside
// fields (notes, especially) survive a round-trip into a spreadsheet.

const COLUMNS = [
  ['company', 'Company'],
  ['role', 'Role'],
  ['status', 'Status'],
  ['dateApplied', 'Date Applied'],
  ['salary', 'Salary'],
  ['link', 'Link'],
  ['nextFollowUp', 'Next Follow-Up'],
  ['notes', 'Notes'],
];

/** Quote a single cell if it contains a comma, quote, or newline; double internal quotes. */
function escapeCell(value) {
  let str = value == null ? '' : String(value);
  // Neutralize CSV formula injection: a cell beginning with = + - @ (or a tab/CR)
  // can execute as a formula when opened in Excel/Sheets. User-controlled fields
  // (company, role, notes…) could carry a payload like `=HYPERLINK(...)`, so we
  // prefix such values with an apostrophe to force literal-text interpretation.
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Serialize the application list to a CSV string. */
export function applicationsToCSV(applications) {
  const header = COLUMNS.map(([, label]) => escapeCell(label)).join(',');
  const rows = applications.map((app) =>
    COLUMNS.map(([key]) => escapeCell(app[key])).join(','),
  );
  return [header, ...rows].join('\r\n');
}

/** Trigger a browser download of the application list as a .csv file. */
export function downloadCSV(applications, filename = 'applications.csv') {
  const csv = applicationsToCSV(applications);
  // Prepend a UTF-8 BOM so Excel reads accented characters correctly.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
