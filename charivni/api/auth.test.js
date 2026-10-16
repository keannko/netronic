import assert from 'node:assert/strict';
import { test } from 'node:test';
import { once } from 'node:events';
import { app } from './app.js';

// Exercise the HTTP contract without any database or external server.
test('temporary API: authentication, permissions, refresh and logout', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const url = `http://127.0.0.1:${server.address().port}`;
  const request = (path, options = {}) => fetch(url + path, options);
  const login = (email, password = '123') => request('/users/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
  });
  try {
    assert.equal((await request('/users')).status, 401);
    assert.equal((await request('/users/refresh')).status, 401);
    assert.equal((await login('admin@gmail.com', 'bad')).status, 401);
    assert.equal((await login('missing@gmail.com')).status, 401);
    assert.equal((await login('', '')).status, 400);
    assert.equal((await login({ unexpected: true })).status, 400);
    for (const email of ['admin@gmail.com', 'user1@gmail.com', 'user2@gmail.com']) {
      const response = await login(email);
      assert.equal(response.status, 200);
      const session = await response.json();
      assert.equal(session.user.email, email);
      assert.equal(session.user.password, undefined);
      assert.equal(session.refreshToken, undefined);
      const cookieHeader = response.headers.get('set-cookie');
      assert.match(cookieHeader, /HttpOnly/i);
      assert.match(cookieHeader, /Path=\//);
      const cookie = cookieHeader.split(';')[0];
      const headers = { Authorization: `Bearer ${session.accessToken}` };
      const profile = await request('/users/bytoken', { headers });
      assert.equal((await profile.json()).email, email);
      const accounts = await request('/users', { headers });
      assert.equal(accounts.status, session.user.role === 'admin' ? 200 : 403);
      if (session.user.role === 'admin') {
        const users = await accounts.json();
        assert.equal(users.length, 3);
        assert.ok(users.every(user => !('password' in user)));
      } else {
        assert.equal((await request('/users/1', { headers })).status, 403);
      }
      assert.deepEqual(await (await request('/products', { headers })).json(), []);
      const refreshed = await request('/users/refresh', { headers: { Cookie: cookie } });
      assert.equal(refreshed.status, 200);
      const current = await refreshed.json();
      assert.equal(current.user.email, email);
      assert.equal((await request('/users/bytoken', { headers })).status, 401);
      assert.equal((await request('/users/refresh', { headers: { Cookie: cookie } })).status, 401);
      const currentCookie = refreshed.headers.get('set-cookie').split(';')[0];
      assert.equal((await request('/users/logout', { method: 'POST', headers: { Cookie: currentCookie } })).status, 200);
      assert.equal((await request('/users/refresh', { headers: { Cookie: currentCookie } })).status, 401);
      assert.equal((await request('/users/bytoken', { headers: { Authorization: `Bearer ${current.accessToken}` } })).status, 401);
    }
    assert.equal((await request('/users/registration', { method: 'POST' })).status, 501);
    assert.equal((await request('/missing')).status, 404);
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});