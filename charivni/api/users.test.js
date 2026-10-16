import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { app } from './app.js';
import { buildWorkMonth } from './users/services.js';

test('monthly hours include weekends, leap years, overrides and future dates', () => {
  const month = buildWorkMonth('2026-10', '2026-10-16', { '2026-10-03': 10, '2026-10-05': 10, '2026-10-06': 0 }, { '2026-10-03': 120, '2026-10-05': 0 });
  assert.equal(month.days.length, 31);
  assert.equal(month.days[0].hours, null);
  assert.equal(month.days[0].efficiency, null);
  assert.equal(month.days[2].efficiency, 120);
  assert.equal(month.days[4].efficiency, 0);
  assert.equal(month.days[5].efficiency, null);
  assert.equal(month.days[16].efficiency, null);
  assert.equal(month.days[2].isWeekend, true);
  assert.equal(month.days[2].hours, 10);
  assert.equal(month.days[3].hours, null);
  assert.equal(month.days[4].hours, 10);
  assert.equal(month.days[5].hours, 0);
  assert.equal(month.days[16].hours, null);
  assert.equal(month.totalHours, month.days.reduce((sum, day) => sum + (day.hours || 0), 0));
  assert.equal(buildWorkMonth('2024-02', '2024-02-29').days.length, 29);
  assert.equal(buildWorkMonth('2025-02', '2025-02-28').days.length, 28);
});

test('employee hours and account settings are authenticated and persist in memory', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, options = {}) => fetch(base + path, options);
  const login = (email, password) => request('/users/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  try {
    assert.equal((await request('/users/hours')).status, 401);
    assert.equal((await request('/users/birthdays')).status, 401);
    assert.equal((await request('/users/settings', { method: 'PATCH' })).status, 401);
    const initial = await login('user1@gmail.com', '123');
    const session = await initial.json();
    assert.equal(session.user.firstName, 'Іван');
    assert.equal(session.user.lastName, 'Петренко');
    assert.equal(session.user.grade, 0);
    const headers = { Authorization: `Bearer ${session.accessToken}`, 'Content-Type': 'application/json' };
    const birthdaysResponse = await request('/users/birthdays', { headers });
    assert.equal(birthdaysResponse.status, 200);
    const birthdays = await birthdaysResponse.json();
    assert.equal(birthdays.isDemo, false);
    assert.equal(birthdays.birthdays.length, 0);
    assert.ok(birthdays.birthdays.every(person => /^\d{2}-\d{2}$/.test(person.date) && !('email' in person) && !('password' in person)));
    const settings = values => request('/users/settings', { method: 'PATCH', headers, body: JSON.stringify(values) });
    const hours = await request('/users/hours', { headers });
    assert.equal(hours.status, 200);
    assert.ok((await hours.json()).days.length >= 28);
    assert.equal((await settings({ email: 'new@gmail.com', currentPassword: 'bad' })).status, 400);
    assert.equal((await settings({ email: 'bad-email', currentPassword: '123' })).status, 400);
    assert.equal((await settings({ email: 'admin@gmail.com', currentPassword: '123' })).status, 409);
    assert.equal((await settings({ email: 'new@gmail.com', currentPassword: '123', newPassword: '12' })).status, 400);
    const updated = await settings({ email: 'updated@gmail.com', currentPassword: '123', newPassword: '456', role: 'admin', grade: 3 });
    assert.equal(updated.status, 200);
    const data = await updated.json();
    assert.equal(data.user.email, 'updated@gmail.com');
    assert.equal(data.user.role, 'user');
    assert.equal(data.user.grade, 0);
    assert.equal(data.user.password, undefined);
    assert.equal((await request('/users/hours', { headers })).status, 401);
    assert.equal((await login('user1@gmail.com', '123')).status, 401);
    assert.equal((await login('updated@gmail.com', '123')).status, 401);
    assert.equal((await login('updated@gmail.com', '456')).status, 200);
    const refresh = await request('/users/refresh', { headers: { Cookie: updated.headers.get('set-cookie').split(';')[0] } });
    assert.equal(refresh.status, 200);
    const current = await refresh.json();
    const emailOnly = await request('/users/settings', { method: 'PATCH', headers: { Authorization: `Bearer ${current.accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'user1@gmail.com', currentPassword: '456', newPassword: '' }) });
    assert.equal(emailOnly.status, 200);
    assert.equal((await login('user1@gmail.com', '456')).status, 200);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});