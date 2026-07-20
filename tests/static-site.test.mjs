import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('自动回复入口与渲染器同时存在', async () => {
  const [html, app] = await Promise.all([
    fs.readFile(new URL('../public/index.html', import.meta.url), 'utf8'),
    fs.readFile(new URL('../public/app.js', import.meta.url), 'utf8')
  ]);
  assert.match(html, /data-view="auto-replies"/);
  assert.match(app, /'auto-replies': renderAutoReplies/);
  assert.match(app, /const renderView = renders\[activeView\] \|\| renderOverview/);
});

test('线上资源使用统一版本号避免缓存错配', async () => {
  const [html, app] = await Promise.all([
    fs.readFile(new URL('../public/index.html', import.meta.url), 'utf8'),
    fs.readFile(new URL('../public/app.js', import.meta.url), 'utf8')
  ]);
  const version = app.match(/ASSET_VERSION = '([^']+)'/)?.[1];
  assert.ok(version);
  assert.match(html, new RegExp(`app\\.js\\?v=${version}`));
  assert.match(html, new RegExp(`auto-replies\\.css\\?v=${version}`));
});
