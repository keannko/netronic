# Analytics integration

The existing admin cabinet includes Analytics. Both reads and writes use the existing Bearer-token authentication and require the current admin role.

The initial data comes from netronic-project.zip: Modules, the complete math snapshot, the planning snapshot and editable 31-day plan, stock, 37 product/assembly catalogs, and SerialNumbers from MainNovember. Live calculations recursively expand the editable catalogs and account for stock. Modules and original snapshots describe the import date; catalog edits affect subsequent calculations.

Stock imports accept Excel/CSV, first worksheet, columns article / name / quantity. Preview and confirm before replacing stock. Export the existing list if needed. Individual stock quantities and catalog components can also be edited.

Serial allocation uses the imported starting value as the last issued number, so the next number is start + 1. Issuance records the employee and range. Historical allocations before this import are not available. Reserved ranges are displayed separately.

Node.js 24+ is required. Start the API and frontend using their existing commands. Analytics persists independently in api/.local/analytics.sqlite (override with SKIFTECH_ANALYTICS_FILE). Preserve the entire api/.local directory when backing up or moving the app. Concurrent updates use version checks and are rejected with HTTP 409 when stale. Reload before retrying.

There is no live Google Sheets synchronization. Update stock through imports; coordinate serial issuance with any external spreadsheet.

Validation: npm test in api includes comparison against 124 source-math values, authorization, stock validation, stale writes, serial allocation, cycle rejection, rollback, and reopening the database. Run npm run build in skft for the frontend.
