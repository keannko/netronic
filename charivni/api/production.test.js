import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dataAccess = fileURLToPath(new URL('./users/dataAccess.js', import.meta.url));
const { NODE_TEST_CONTEXT, ...environment } = process.env;
void NODE_TEST_CONTEXT;

test('production requires persistent storage and creates an explicit admin without demo accounts', () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'skiftech-release-'));
  const storage = path.join(directory, 'data.json');
  const run = overrides => spawnSync(process.execPath, ['--input-type=module', '-e', `await import(${JSON.stringify(new URL('./users/dataAccess.js', import.meta.url).href)})`], {
    env: { ...environment, NODE_ENV: 'production', ...overrides }, encoding: 'utf8', cwd: path.dirname(dataAccess),
  });

  try {
    assert.notEqual(run({ SKIFTECH_STORAGE_FILE: '' }).status, 0);
    assert.notEqual(run({ SKIFTECH_STORAGE_FILE: storage, SKIFTECH_ADMIN_EMAIL: '', SKIFTECH_ADMIN_PASSWORD: '' }).status, 0);
    const result = run({ SKIFTECH_STORAGE_FILE: storage, SKIFTECH_ADMIN_EMAIL: 'release@example.org', SKIFTECH_ADMIN_PASSWORD: 'long-unique-admin-password' });
    assert.equal(result.status, 0, result.stderr);
    const saved = JSON.parse(readFileSync(storage, 'utf8'));
    assert.equal(saved.users.length, 1);
    assert.equal(saved.users[0].email, 'release@example.org');
    assert.equal(saved.users[0].role, 'admin');
    assert.notEqual(saved.users[0].password, 'long-unique-admin-password');
  } finally {
    try { unlinkSync(storage); } catch { /* storage may not exist if setup fails */ }
    rmdirSync(directory);
  }
});
