import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('saved workday is visible in initial timesheet after API process restart', () => {
  const folder = mkdtempSync(path.join(tmpdir(), 'skiftech-storage-'));
  const file = path.join(folder, 'data.json');
  const service = new URL('./users/services.js', import.meta.url).href;
  const admin = new URL('./admin/services.js', import.meta.url).href;
  const run = code => {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', code], { env: { ...process.env, SKIFTECH_STORAGE_FILE: file }, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout.trim());
  };
  try {
    run(`const s = await import(${JSON.stringify(service)}); const date=s.getCurrentDate(); const report=await s.createWorkdayEntryService('2',{date,hoursWorked:8,rows:[{product:'1',process:'1',quantity:24}]}); console.log(JSON.stringify(report));`);
    const result = run(`const {getTimesheetService}=await import(${JSON.stringify(admin)});console.log(JSON.stringify(await getTimesheetService()));`);
    const employee = result.find(item => item.user.userID === '2');
    const day = employee.days.find(day => day.date === employee.today);
    assert.equal(day.hours, 8);
    assert.equal(day.efficiency, 75);
    assert.equal(employee.entries[0].efficiency, 75);
    assert.ok(result.find(item => item.user.userID === '3').days.every(day => day.hours === null && day.efficiency === null));
  } finally {
    for (const target of [file, file + '.tmp']) if (existsSync(target)) unlinkSync(target);
    rmdirSync(folder);
  }
});