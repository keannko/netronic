import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const path = process.env.SKIFTECH_ANALYTICS_FILE || (process.env.NODE_TEST_CONTEXT ? ':memory:' : fileURLToPath(new URL('../.local/analytics.sqlite', import.meta.url)));
if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
export const analyticsDatabase = new DatabaseSync(path);
analyticsDatabase.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
