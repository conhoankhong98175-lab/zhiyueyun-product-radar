import { readCsv, buildDashboard } from './nlp-core.js';

let data;
let activeView = 'overview';
let documents = { readme: '', solution: '', problem: '', aiSolution: '', workflow: '' };
const view = document.querySelector('#view');
const dialog = document.querySelector('#detail-dialog');
const fmt = new Intl.NumberFormat('zh-CN');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pct = (n) => `${Math.round((n || 0) * 100)}%`;
const badge = (text, cls = '') => `<span class="badge ${cls}">${esc(text)}</span>`;
const sentimentBadge = (s) => badge(s, s === '负面' ? 'red' : s === '正面' ? 'green' : '');

async function load() {
  const [res, readme, solution, problem, aiSolution, workflow] = await Promise.all([
    fetch('./data/dashboard.json'),
    fetch('./README.md').then((r) => r.text()),
    fetch('./SOLUTION.md').then((r) => r.text()),
    fetch('./PROBLEM_DEFINITION.md').then((r) => r.text()),
    fetch('./AI_SOLUTION.md').then((r) => r.text()),
    fetch('./WORKFLOW.md').then((r) => r.text())
  ]);
  data = await res.json();
  documents = { readme, solution, problem, aiSolution, workflow };
  setMeta();
  render();
}

function setMeta() {
  const dates = data.records.map((r) => r.date).filter(Boolean).sort();
  document.querySelector('#period').textContent = dates.length ? `${dates[0]} 至 ${dates.at(-1)} · CSV 本地数据` : 'CSV 本地数据';
  document.querySelector('#updated').textContent = `更新于 ${new Date(data.generatedAt).toLocaleString('zh-CN', { hour12: false })}`;
}

const titles = { overview: '产品洞察总览', clusters: '共性问题聚类', feedback: '反馈明细与分诊', actions: '行动转化中心', evaluation: '模型质量评估', readme: '项目说明', solution: '输入—处理—输出完整方案', problem: '问题定义', 'ai-solution': 'AI Solution', workflow: 'Workflow' };
document.querySelector('#nav').addEventListener('click', (e) => {
  const button = e.target.closest('[data-view]');
  if (!button) return;
  activeView = button.dataset.view;
  document.querySelectorAll('.nav-item').forEach((x) => x.classList.toggle('active', x === button));
  document.querySelector('#page-title').textContent = titles[activeView];
  render();
});

document.querySelector('#csv-input').addEventListener('change', async (e) => {
  const groups = { ...(data.referenceData || {}) };
  const accepted = [], rejected = [];
  for (const file of e.target.files) {
    const parsed = readCsv(await file.text());
    if (parsed.type === 'unknown') rejected.push(file.name);
    else { groups[parsed.type] = parsed.rows; accepted.push(`${file.name}（${parsed.rows.length}条）`); }
  }
  if (accepted.length) {
    data = buildDashboard(groups);
    setMeta(); render();
  }
  const notice = document.querySelector('#notice');
  notice.classList.remove('hidden');
  notice.textContent = `${accepted.length ? `已完成本地分析：${accepted.join('、')}` : '没有可识别的数据'}${rejected.length ? `；未识别：${rejected.join('、')}` : ''}`;
  setTimeout(() => notice.classList.add('hidden'), 7000);
  e.target.value = '';
});

function render() {
  const renders = { overview: renderOverview, clusters: renderClusters, feedback: renderFeedback, actions: renderActions, evaluation: renderEvaluation, readme: () => renderDocument(documents.readme), solution: () => renderDocument(documents.solution), problem: () => renderDocument(documents.problem), 'ai-solution': () => renderDocument(documents.aiSolution), workflow: () => renderDocument(documents.workflow) };
  view.innerHTML = renders[activeView]();
  bindViewEvents();
}

function renderOverview() {
  const s = data.summary;
  const top = data.clusters.filter((c) => !['overall', 'noise'].includes(c.id)).slice(0, 3);
  const max = Math.max(...data.clusters.map((c) => c.count), 1);
  const topics = data.clusters.filter((c) => c.id !== 'overall').slice(0, 8);
  return `
    <div class="kpi-grid">
      ${kpi('反馈总量', fmt.format(s.total), `${s.actionable} 条有效产品信号`, '▤')}
      ${kpi('有效信号率', pct(s.actionable / s.total), `过滤 ${s.noise} 条噪声`, '⌁')}
      ${kpi('负面反馈', fmt.format(s.negative), `${pct(s.negative / s.total)} 的全部反馈`, '↓', 'bad')}
      ${kpi('共性主题', data.clusters.length, '跨渠道统一归类', '◉')}
      ${kpi('候选行动', s.pendingActions, '待人工确认后流转', '✓')}
    </div>
    <div class="grid-main">
      <section class="card panel">
        <div class="panel-head"><div><h2>高频产品信号</h2><p>按反馈规模展示，优先级另综合负面、影响、角色与趋势</p></div><button class="link-button" data-go="clusters">查看全部 →</button></div>
        <div class="topic-bars">${topics.map((c) => `<div class="topic-row"><div class="topic-label">${esc(c.topic)}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.max(3, c.count / max * 100)}%"></div></div><div class="topic-value"><b>${c.count}</b>条 · ${c.negativeRate}%负面</div></div>`).join('')}</div>
      </section>
      <section class="card panel">
        <div class="panel-head"><div><h2>值得放大的正面卖点</h2><p>来自真实正面文本，不使用星级替代情感</p></div></div>
        <div class="signal-list">${data.positiveSignals.slice(0, 5).map((x, i) => `<div class="signal"><span class="signal-rank">${i + 1}</span><div><b>${esc(x.topic)}</b><small>正面反馈聚合</small></div><strong>${x.count}</strong></div>`).join('') || '<div class="empty">暂无正面信号</div>'}</div>
      </section>
    </div>
    <div class="panel-head"><div><h2>建议优先处理的 Top 3</h2><p>每项均可追溯聚类证据、代表评论、责任人和临时方案</p></div></div>
    <div class="top3-grid">${top.map((c, i) => painCard(c, i)).join('')}</div>`;
}

function kpi(label, value, note, icon, cls = '') { return `<div class="card kpi"><div class="kpi-label"><span>${label}</span><i>${icon}</i></div><strong class="${cls}">${value}</strong><small>${note}</small></div>`; }

function painCard(c, i) {
  return `<article class="card pain-card"><div class="pain-top"><span class="rank">TOP ${i + 1}</span><span class="score">优先分 ${c.score}</span></div><h3>${esc(c.topic)}</h3><p>${esc(c.action)}</p><div class="metrics"><span>${c.count} 条证据</span><span>${c.users} 位用户</span><span>${c.negativeRate}% 负面</span></div><button class="secondary" data-cluster="${c.id}">查看证据与建议</button></article>`;
}

function renderClusters() {
  return `<div class="section-head"><h2>${data.clusters.length} 个共性主题</h2><div class="filters"><select id="cluster-sort"><option value="score">按优先分</option><option value="count">按规模</option><option value="negativeRate">按负面率</option></select></div></div><div id="cluster-grid" class="cluster-grid">${clusterCards(data.clusters)}</div>`;
}

function clusterCards(clusters) {
  return clusters.map((c) => `<article class="card cluster-card" data-cluster="${c.id}" role="button"><div class="pain-top">${badge(c.status, c.status.includes('立即') ? 'red' : c.status.includes('修复') ? 'green' : 'blue')}<span class="cluster-score">${c.score}</span></div><h3>${esc(c.topic)}</h3><div class="mini-bar"><i style="width:${c.negativeRate}%"></i></div><div class="cluster-meta"><span>${c.count} 条 / ${c.users} 人</span><span>${c.negativeRate}% 负面</span><span>${c.trend >= 0 ? '↑' : '↓'} ${Math.abs(c.trend)}%</span></div></article>`).join('');
}

function renderFeedback() {
  const rows = data.records.slice(0, 250);
  const topics = [...new Set(data.records.map((r) => r.topic))];
  return `<div class="section-head"><h2>反馈原子明细 <span class="badge">最多展示250条</span></h2><div class="filters"><input id="search" placeholder="搜索原文或用户"><select id="topic-filter"><option value="">全部主题</option>${topics.map((x) => `<option>${esc(x)}</option>`).join('')}</select><select id="sentiment-filter"><option value="">全部情感</option><option>负面</option><option>中性</option><option>正面</option></select></div></div><div class="card table-wrap"><table><thead><tr><th>来源</th><th>反馈内容</th><th>智能分诊</th><th>情感</th><th>信号强度</th><th>日期</th></tr></thead><tbody id="feedback-body">${feedbackRows(rows)}</tbody></table></div>`;
}

function feedbackRows(rows) {
  return rows.map((r) => `<tr data-topic="${esc(r.topic)}" data-sentiment="${r.sentiment}" data-search="${esc(`${r.author} ${r.text}`.toLowerCase())}"><td>${esc(r.channel)}<br><small>${esc(r.author)}</small></td><td class="text-cell">${esc(r.text)}</td><td>${badge(r.feedbackType, r.feedbackType.includes('问题') ? 'red' : r.feedbackType === '功能需求' ? 'blue' : '')}<br><small>${esc(r.topic)}</small></td><td>${sentimentBadge(r.sentiment)}</td><td>${r.signal.toFixed(1)}</td><td>${esc(r.date)}</td></tr>`).join('');
}

function renderActions() {
  const urgent = data.actions.filter((a) => a.severity >= 1.8 || a.role === 'VIP客户').slice(0, 12);
  const linked = data.actions.filter((a) => a.backlogMatch?.id).slice(0, 12);
  const newOnes = data.actions.filter((a) => !a.backlogMatch?.id).slice(0, 12);
  return `<div class="section-head"><div><h2>从信号到行动</h2><p class="eyebrow">所有卡片均需产品或客服确认后进入正式流程</p></div></div><div class="action-layout">${kanban('高优问题 / Bug', urgent, 'urgent')}${kanban('关联已有需求', linked, 'linked')}${kanban('候选新需求', newOnes, 'new')}</div>`;
}

function kanban(title, items, kind) {
  return `<section class="kanban"><h2>${title}<span>${items.length}</span></h2>${items.map((a) => `<article class="card action-card"><div>${sentimentBadge(a.sentiment)} ${badge(a.feedbackType, 'blue')}</div><h3>${esc(a.topic)}</h3><p>${esc(a.text.length > 95 ? `${a.text.slice(0, 95)}…` : a.text)}</p><div class="action-footer"><span>${kind === 'linked' ? `${a.backlogMatch.id} · ${a.backlogMatch.title}` : kind === 'new' ? '查重：未发现高相似需求' : `严重度 ${a.severity}`}</span><button class="link-button" data-action="${a.id}">查看</button></div></article>`).join('') || '<div class="card empty">暂无卡片</div>'}</section>`;
}

function renderEvaluation() {
  const e = data.evaluation;
  return `<div class="eval-grid">${evalCard('测试样本', e.sampleSize, '人工标注独立子集')}${evalCard('主题准确率', pct(e.topicAccuracy), '16类业务主题')}${evalCard('主题 Macro-F1', pct(e.topicMacroF1), '兼顾少数类别')}${evalCard('情感 Macro-F1', pct(e.sentimentMacroF1), '正 / 负 / 中均衡评价')}</div><div class="method"><section class="card panel"><h3>评估口径</h3><ul><li>情感以评论文本的真实态度为准，星级仅作为弱特征，反讽规则优先。</li><li>主题使用人工标注的150条子集评估；正式汇报建议冻结最终测试集，避免边调词库边报分。</li><li>Macro-F1用于防止“全部预测成负面”在类别不均衡时获得虚高成绩。</li><li>聚类上线验收另抽样检查簇内一致率、跨渠道合并正确率和需求查重Top-1准确率。</li></ul></section><section class="card panel"><h3>模型边界与人工审核</h3><ul><li>当前是可解释的本地规则基线，适合演示、冷启动和敏感数据离线场景。</li><li>低置信度、财务风险、隐私安全及VIP续约事项必须人工确认。</li><li>自动回复只生成草稿；事实内容受智阅云知识库约束，不自动对外发送。</li><li>后续可将规则结果作为弱标签，升级为中文向量模型与监督分类器。</li></ul></section></div>`;
}

function evalCard(label, value, note) { return `<div class="card eval-score"><span class="eyebrow">${label}</span><strong>${value}</strong><p>${note}</p></div>`; }

function renderDocument(markdown) {
  const lines = String(markdown || '').split(/\r?\n/);
  let html = '', inCode = false, inTable = false, inList = false;
  const inline = (s) => esc(s)
    .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img class="doc-image" src="$2" alt="$1">')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  const closeList = () => { if (inList) { html += '</ul>'; inList = false; } };
  const closeTable = () => { if (inTable) { html += '</tbody></table></div>'; inTable = false; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) { closeList(); closeTable(); html += inCode ? '</code></pre>' : '<pre><code>'; inCode = !inCode; continue; }
    if (inCode) { html += `${esc(line)}\n`; continue; }
    if (/^\|.*\|$/.test(line)) {
      closeList();
      if (/^\|[\s:|-]+\|$/.test(line)) continue;
      const cells = line.slice(1, -1).split('|').map((x) => inline(x.trim()));
      if (!inTable) { html += `<div class="doc-table"><table><thead><tr>${cells.map((x) => `<th>${x}</th>`).join('')}</tr></thead><tbody>`; inTable = true; }
      else html += `<tr>${cells.map((x) => `<td>${x}</td>`).join('')}</tr>`;
      continue;
    }
    closeTable();
    if (!line.trim()) { closeList(); continue; }
    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) { closeList(); const level = Math.min(4, h[1].length + 1); html += `<h${level}>${inline(h[2])}</h${level}>`; continue; }
    if (/^[-*]\s+/.test(line)) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`; continue; }
    if (/^\d+\.\s+/.test(line)) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`; continue; }
    closeList();
    html += `<p>${inline(line)}</p>`;
  }
  closeList(); closeTable();
  return `<article class="card document">${html}</article>`;
}

function bindViewEvents() {
  view.querySelectorAll('[data-go]').forEach((x) => x.addEventListener('click', () => { document.querySelector(`[data-view="${x.dataset.go}"]`).click(); }));
  view.querySelectorAll('[data-cluster]').forEach((x) => x.addEventListener('click', () => showCluster(x.dataset.cluster)));
  view.querySelectorAll('[data-action]').forEach((x) => x.addEventListener('click', () => showAction(x.dataset.action)));
  document.querySelector('#cluster-sort')?.addEventListener('change', (e) => { const sorted = [...data.clusters].sort((a, b) => b[e.target.value] - a[e.target.value]); document.querySelector('#cluster-grid').innerHTML = clusterCards(sorted); bindViewEvents(); });
  const filter = () => {
    const q = (document.querySelector('#search')?.value || '').toLowerCase(), topic = document.querySelector('#topic-filter')?.value, sentiment = document.querySelector('#sentiment-filter')?.value;
    document.querySelectorAll('#feedback-body tr').forEach((tr) => tr.classList.toggle('hidden', !!((q && !tr.dataset.search.includes(q)) || (topic && tr.dataset.topic !== topic) || (sentiment && tr.dataset.sentiment !== sentiment))));
  };
  ['#search', '#topic-filter', '#sentiment-filter'].forEach((s) => document.querySelector(s)?.addEventListener('input', filter));
}

function showCluster(id) {
  const c = data.clusters.find((x) => x.id === id);
  if (!c) return;
  document.querySelector('#dialog-content').innerHTML = `<div class="dialog-body"><div>${badge(c.status, c.status.includes('立即') ? 'red' : 'blue')}</div><h2>${esc(c.topic)}</h2><p class="dialog-sub">责任团队：${esc(c.owner)} · 建议优先分 ${c.score}</p><div class="dialog-stats"><div><b>${c.count}</b><small>反馈证据</small></div><div><b>${c.users}</b><small>独立用户</small></div><div><b>${c.channels}</b><small>覆盖渠道</small></div><div><b>${c.negativeRate}%</b><small>负面占比</small></div></div><h3>代表反馈</h3>${c.representatives.map((r) => `<blockquote class="quote">“${esc(r.text)}”<br><small>${esc(r.channel)} · ${esc(r.role)}${r.likes ? ` · ${r.likes}赞` : ''}</small></blockquote>`).join('')}<h3>建议行动</h3><div class="recommend"><b>${esc(c.action)}</b><br>临时方案：${esc(c.workaround)}</div></div>`;
  dialog.showModal();
}

function showAction(id) {
  const a = data.actions.find((x) => x.id === id);
  if (!a) return;
  const m = a.backlogMatch;
  document.querySelector('#dialog-content').innerHTML = `<div class="dialog-body"><div>${sentimentBadge(a.sentiment)} ${badge(a.feedbackType, 'blue')}</div><h2>${esc(a.topic)}</h2><p class="dialog-sub">${esc(a.channel)} · ${esc(a.author)} · ${esc(a.date)}</p><blockquote class="quote">${esc(a.text)}</blockquote><h3>需求池查重</h3><div class="recommend">${m.id ? `<b>${esc(m.decision)}：${esc(m.id)} ${esc(m.title)}</b><br>语义相似度 ${Math.round(m.similarity * 100)}% · 当前状态 ${esc(m.status || '-')} · 优先级 ${esc(m.priority || '-')}` : `<b>${esc(m.decision)}</b><br>未发现达到阈值的已有需求`}</div><h3>回复草稿</h3><blockquote class="quote">${esc(a.reply)}</blockquote><button class="primary">确认后创建行动卡片</button></div>`;
  dialog.showModal();
}

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

load().catch((err) => { view.innerHTML = `<div class="card empty">数据加载失败：${esc(err.message)}。请先运行 npm run build:data。</div>`; });
