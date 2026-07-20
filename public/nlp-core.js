/* 智阅云产品雷达：零依赖、可解释的中文 NLP 基线。浏览器与 Node 共用。 */

export const TOPICS = [
  { id: 'stamp', label: '识别准确性-印章遮挡', words: ['印章', '盖章', '红章', '章盖', '章压', 'stamp', 'スタンプ', '价税合计', '8600', '3600'], weight: 1.35 },
  { id: 'table', label: '识别准确性-表格导出', words: ['合并单元格', 'excel错位', 'excel列', '表格导出', '列对不上', '导出就乱', '错位', '跑到别的列', '对账单'], weight: 1.2 },
  { id: 'field', label: '识别准确性-其他字段', words: ['识别错', '识别错误', '小数点', '出发站', '到达站', '乱码', '手写', '字段', '金额错误', '误识别'], weight: 1.05 },
  { id: 'batch', label: '稳定性-批量上传', words: ['批量上传', '批量识别', '文件一多', '四十多个', '48个', '超时', 'upload_timeout', '整批失败', '转圈'], weight: 1.25 },
  { id: 'crash', label: '稳定性-闪退与登录', words: ['闪退', '闪腿', '崩溃', '拍照就崩', '登录', '不登录', '安卓14', '重装'], weight: 1.15 },
  { id: 'performance', label: '性能', words: ['变慢', '很慢', '速度', '排队', '响应', '转半天', '加载', '卡顿', '秒出'], weight: 1.0 },
  { id: 'format', label: '兼容性-文件格式', words: ['heic', 'ofd', '加密pdf', 'doc_encrypted', '格式不支持', 'safari', '下载按钮', '文件格式'], weight: 1.0 },
  { id: 'api', label: 'API与集成', words: ['api', 'qps', '429', 'retry-after', '回调', 'webhook', '接口', '用友', '金蝶', '限流'], weight: 1.1 },
  { id: 'ads', label: '产品体验-广告弹窗', words: ['广告', '弹窗', '开屏', '关闭按钮', '关闭弹窗', '产品经理自己每天打开', '找关闭', '会员促销'], weight: 1.15 },
  { id: 'experience', label: '产品体验-其他', words: ['提示', '错误码', '入口', '难用', '设计', '体验', '界面', '提醒', '到期提醒'], weight: 0.9 },
  { id: 'price', label: '价格与计费', words: ['29', '价格', '太贵', '贵了', '涨价', '额度', '100页', '续费', '订阅', '学生价', '加油包', '付费'], weight: 0.95 },
  { id: 'service', label: '客服服务', words: ['客服', '已记录', '套话', '回复慢', '响应慢', '没人回', '态度'], weight: 0.95 },
  { id: 'privacy', label: '数据与隐私', words: ['隐私', '泄露', '保存多久', '保留90天', '90天', '数据丢', '自动清理', '安全', '内网', '私有化'], weight: 1.05 },
  { id: 'feature', label: '新功能需求', words: ['希望', '建议', '能不能', '要是能', '支持', '需求', '暗黑模式', 'word', '医疗发票', '银行回单', '自定义', '模板', '批量扫描', '月汇总', '差旅总额', '日语', '英文合同', '小程序'], weight: 1.0 },
  { id: 'overall', label: '整体评价', words: ['好用', '不错', '推荐', '神器', '五星', '四星', '效率', '救星', '必备', '整体', '準', '准'], weight: 0.8 },
  { id: 'noise', label: '噪声无关', words: [], weight: 0 }
];

export const BUSINESS_LEXICON = {
  objects: ['发票', '票据', '表格', '合同', '银行回单', '对账单', '医疗票', '火车票', '出租车票', 'pdf', 'excel', 'api', '小程序'],
  risk: ['金额', '价税合计', '财务风险', '报销', '汇总失真', '数据丢', '泄露', '中断', '全部失败', '返工', '投诉'],
  urgency: ['紧急', '尽快', '立刻', '马上', '月底', '催', '续约', '签约前提', '今天', '上线时间'],
  scale: ['几千', '几百', '大量', '批量', '每天', '每月', '多个客户', '普遍', '反复', '十余张'],
  positive: ['好用', '不错', '推荐', '神器', '救星', '准确', '挺准', '省了', '效率', '快十倍', '点个赞', '点赞', '修复了', '清楚', '态度好', '实用', '完美', '很方便', '快多了', '狂喜', '已续费', '字段全对', '良心', 'impressive', 'muy buena', 'best invoice', 'great ocr'],
  negative: ['差评', '垃圾', '辣鸡', '错误', '失败', '错位', '闪退', '崩溃', '超时', '乱码', '后怕', '离谱', '折腾', '劝退', '流氓', '投诉', '返工', '不能用', '看不懂', '误导', '不准', '慢', '烦', '乱', '不够', '不支持', '搞反', '拖了', '硬伤', '必挂', '挂了', '废了', '血泪', '卸载', '藏得', '故意', '抓瞎', '慎重', '没有然后', '虚假', '不配', '减分', '变形', '漂移', '保守', '绕死', '差点', '肉疼', '不便宜', '废孒', '誤認識', 'needs work'],
  intensifiers: ['非常', '太', '特别', '严重', '完全', '全部', '必', '老是', '一直', '反复', '三次', '十余'],
  negations: ['不', '没', '无', '未', '别', '无法', '不能']
};

const NOISE_PATTERNS = [
  /互赞|互评|扣1|先五星后使用|刷到.*发财|代开.*票|低价转|联系我|打卡|大盘怎么样|外卖软件|查社保|五一去哪|下载错了/iu,
  /^(好|行|凑合|一般|不错|用用再说|早|。|！|!|[\p{Emoji}\s]+)$/u
];

const SARCASM_NEG = [/关闭弹窗.*游戏|提神醒脑.*五星|产品经理自己|弹窗多到|好用.*实习生辞|识别太快.*摸鱼|再这么好用.*岗位|一星警告.*好用/iu];
const SARCASM_POS = [/一星.*好用|一星是因为太好用|手滑.*五星|评分.*改不了.*好用/iu];

export function parseCSV(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  text = String(text || '').replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field.trim()); field = ''; }
    else if (ch === '\n') { row.push(field.trim().replace(/\r$/, '')); if (row.some(Boolean)) rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field || row.length) { row.push(field.trim()); if (row.some(Boolean)) rows.push(row); }
  return rows;
}

export function detectCsvType(header) {
  const h = header.join('|');
  if (h.includes('评论ID') && h.includes('平台')) return 'reviews';
  if (h.includes('主题标签') && h.includes('情感标签')) return 'annotations';
  if (h.includes('问题描述') && h.includes('紧急程度')) return 'tickets';
  if (h.includes('需求概述') && h.includes('期望时间')) return 'requests';
  if (h.includes('需求ID') && h.includes('优先级')) return 'backlog';
  if (h.includes('昵称/显示名') && h.includes('角色')) return 'roles';
  return 'unknown';
}

function objectsFromRows(rows, type) {
  const header = rows[0] || [];
  return rows.slice(1).map((r) => {
    if (type === 'tickets' && r.length > header.length) r = [...r.slice(0, 4), r.slice(4, -1).join('，'), r.at(-1)];
    if (type === 'backlog' && r.length > header.length) {
      const dateIndex = r.findIndex((v, i) => i > 2 && /^20\d\d-\d\d-\d\d$/.test(v));
      if (dateIndex > 0) r = [r[0], r[1], r.slice(2, dateIndex - 1).join('，'), r[dateIndex - 1], ...r.slice(dateIndex)];
    }
    return Object.fromEntries(header.map((key, i) => [key, r[i] ?? '']));
  });
}

export function readCsv(text) {
  const rows = parseCSV(text);
  const type = detectCsvType(rows[0] || []);
  return { type, rows: objectsFromRows(rows, type) };
}

export function normalizeText(input) {
  return String(input || '').toLowerCase()
    .replace(/[“”‘’'"`]/g, '')
    .replace(/闪腿/g, '闪退').replace(/发piao|fa票/gi, '发票')
    .replace(/ｅｘｃｅｌ/gi, 'excel').replace(/ａｐｉ/gi, 'api')
    .replace(/[\[【](狗头|捂脸|微笑|叹气|抱拳)[\]】]/g, ' $1 ')
    .replace(/\s+/g, ' ').trim();
}

function countHits(text, words) {
  return words.reduce((n, w) => n + (text.includes(w.toLowerCase()) ? 1 : 0), 0);
}

export function isNoise(text) {
  const t = normalizeText(text);
  if (!t || NOISE_PATTERNS.some((p) => p.test(t))) return true;
  const meaningful = countHits(t, BUSINESS_LEXICON.objects) + TOPICS.slice(0, -2).reduce((n, x) => n + countHits(t, x.words), 0);
  return t.replace(/[^\p{L}\p{N}]/gu, '').length < 4 && meaningful === 0;
}

export function classifyTopic(text) {
  const t = normalizeText(text);
  if (isNoise(t)) return { id: 'noise', label: '噪声无关', confidence: 0.96, scores: {} };
  const scores = {};
  for (const topic of TOPICS.slice(0, -1)) scores[topic.id] = countHits(t, topic.words) * topic.weight;
  // 领域优先规则：出现印章覆盖语义时，不能被泛化的“识别错误”标签抢走。
  if (/印章|盖章|红章|章盖|章压|stamp|スタンプ|价税合计/.test(t)) scores.stamp += 2.4;
  // “希望/能不能支持”只是需求意图，具体问题主题优先。
  if (scores.feature && Object.entries(scores).some(([k, v]) => !['feature', 'overall'].includes(k) && v >= 1)) scores.feature *= 0.55;
  if (scores.overall && Object.entries(scores).some(([k, v]) => !['feature', 'overall'].includes(k) && v >= 1)) scores.overall *= 0.45;
  let best = TOPICS.filter((x) => x.id !== 'noise').sort((a, b) => scores[b.id] - scores[a.id])[0];
  if (!best || scores[best.id] === 0) best = TOPICS.find((x) => x.id === 'overall');
  const second = Object.values(scores).sort((a, b) => b - a)[1] || 0;
  const confidence = Math.min(0.97, 0.55 + Math.max(0, scores[best.id] - second) * 0.12 + Math.min(scores[best.id], 3) * 0.06);
  return { id: best.id, label: best.label, confidence, scores };
}

export function analyzeSentiment(text, rating = '') {
  const t = normalizeText(text);
  if (isNoise(t)) return { label: '中性', score: 0, confidence: 0.9 };
  let score = countHits(t, BUSINESS_LEXICON.positive) - countHits(t, BUSINESS_LEXICON.negative) * 1.15;
  if (SARCASM_NEG.some((p) => p.test(t))) score = Math.min(score, -2.2);
  if (SARCASM_POS.some((p) => p.test(t))) score = Math.max(score, 2.1);
  if (/修复了|改回五星|补回四星|给官方点个赞/.test(t)) score += 1.8;
  if (/就是|但是|不过|可惜|wish/.test(t) && score > 0 && countHits(t, BUSINESS_LEXICON.negative)) score *= 0.45;
  const stars = Number(rating);
  if (Number.isFinite(stars) && !SARCASM_NEG.some((p) => p.test(t)) && !SARCASM_POS.some((p) => p.test(t))) score += (stars - 3) * 0.48;
  if (/但是|但|就是|不过|可惜|though|but/.test(t) && countHits(t, BUSINESS_LEXICON.negative)) score -= 0.35;
  if (/^卒$|无语|笑不出来|玄学|那我要你干嘛|写人话|修好叫我/.test(t)) score -= 1;
  const label = score > 0.55 ? '正面' : score < -0.45 ? '负面' : '中性';
  return { label, score: Math.max(-3, Math.min(3, Number(score.toFixed(2)))), confidence: Math.min(0.96, 0.58 + Math.abs(score) * 0.11) };
}

export function classifyFeedbackType(text, topic, sentiment) {
  const t = normalizeText(text);
  if (topic.id === 'noise') return '噪声';
  if (/问|请问|怎么|多少|哪里|是否|有没有/.test(t) && !/希望|建议|能不能支持/.test(t)) return '咨询';
  if (/希望|建议|要是能|能不能支持|需求|催更|wish/.test(t) || topic.id === 'feature') return '功能需求';
  if (sentiment.label === '正面' && ['overall', 'performance'].includes(topic.id)) return '表扬';
  if (['stamp', 'table', 'field', 'batch', 'crash', 'performance', 'format', 'api'].includes(topic.id)) return '问题/Bug';
  return sentiment.label === '负面' ? '体验问题' : '一般反馈';
}

function inferRole(name, roleMap = {}) {
  const n = String(name || '');
  const exact = roleMap[n];
  if (exact) return exact;
  if (/华瑞保险|蓝海物流|星辰财税/.test(n)) return 'VIP客户';
  if (/销售/.test(n)) return '内部销售';
  return '普通用户';
}

const ROLE_WEIGHT = { VIP客户: 1.45, 内部销售: 1.15, 客服: 1.1, 研发: 1.0, 普通用户: 1.0 };

export function normalizeInputs(groups) {
  const roleMap = Object.fromEntries((groups.roles || []).map((r) => [r['昵称/显示名'], r['角色']]));
  const out = [];
  for (const r of groups.reviews || []) out.push({ id: r['评论ID'], date: r['日期'], channel: r['平台'] || '应用商店', author: r['用户昵称'] || '匿名用户', text: r['评论内容'], rating: Number(r['评分(1-5)']) || null, likes: Number(r['点赞数']) || 0, role: '普通用户', sourceType: '应用商店评论' });
  for (const [i, r] of (groups.tickets || []).entries()) out.push({ id: `FB-${String(i + 1).padStart(3, '0')}`, date: r['反馈日期'], channel: '客服工单', author: r['客户/用户'] || '匿名用户', text: [r['问题描述'], r['客服备注']].filter(Boolean).join('；'), urgency: r['紧急程度'], role: inferRole(r['客户/用户'], roleMap), sourceType: '问题反馈表' });
  for (const [i, r] of (groups.requests || []).entries()) out.push({ id: `SR-${String(i + 1).padStart(3, '0')}`, date: r['登记日期'], channel: '销售登记', author: r['客户名称'] || r['登记人'], text: [r['需求概述'], r['背景/预期价值'], r['期望时间']].filter(Boolean).join('；'), urgency: r['期望时间'], role: inferRole(r['客户名称'], roleMap), sourceType: '需求登记表' });
  return out.filter((r) => r.text);
}

function severity(record, topic) {
  const t = normalizeText(record.text);
  let s = 1 + countHits(t, BUSINESS_LEXICON.risk) * 0.28 + countHits(t, BUSINESS_LEXICON.urgency) * 0.2 + countHits(t, BUSINESS_LEXICON.scale) * 0.12;
  if (['stamp', 'batch', 'table'].includes(topic.id)) s += 0.25;
  if (/高|紧急/.test(record.urgency || '')) s += 0.35;
  return Math.min(2.4, s);
}

export function analyzeRecord(record) {
  const topic = classifyTopic(record.text);
  const sentiment = analyzeSentiment(record.text, record.rating);
  const type = classifyFeedbackType(record.text, topic, sentiment);
  const sev = severity(record, topic);
  const signal = (topic.id === 'noise' ? 0 : 1) * (1 + Math.log1p(record.likes || 0) * 0.12) * sev * (ROLE_WEIGHT[record.role] || 1);
  return { ...record, normalizedText: normalizeText(record.text), topicId: topic.id, topic: topic.label, topicConfidence: topic.confidence, sentiment: sentiment.label, sentimentScore: sentiment.score, sentimentConfidence: sentiment.confidence, feedbackType: type, severity: Number(sev.toFixed(2)), signal: Number(signal.toFixed(2)) };
}

const ACTION_META = {
  stamp: { owner: '算法团队', status: '需立即干预', action: '先上线价税合计一致性校验与标黄提醒，再专项优化印章遮挡模型', workaround: '提示用户人工核对印章覆盖区域的金额字段' },
  batch: { owner: '平台研发', status: '修复验证中', action: '修复OSS中转300秒超时参数，并以40—50文件/400MB以上批次做回归', workaround: '正式修复前每批控制在20个文件以内' },
  table: { owner: '表格识别团队', status: '待排期', action: '关联REQ-009，补充合并单元格结构还原与列对齐回归集', workaround: '建议拆分复杂表格或导出后人工复核合计列' },
  crash: { owner: '移动端团队', status: '已修复·观察中', action: '持续观察v3.8.2后安卓14闪退复发率', workaround: '升级至v3.8.2或更高版本' },
  ads: { owner: '增长与体验团队', status: '待评估', action: '按付费状态限制弹窗数量，监控关闭率与差评变化', workaround: '无' },
  api: { owner: '开放平台团队', status: '待评估', action: '区分配额咨询与429产品问题，企业客户提供提额入口', workaround: '降低调用频率；企业版提交提额申请' }
};

function trendScore(records, maxDate) {
  if (!records.length || !maxDate) return 0.5;
  const max = new Date(maxDate).getTime();
  const recent = records.filter((r) => max - new Date(r.date).getTime() <= 7 * 864e5).length;
  const previous = records.filter((r) => { const d = max - new Date(r.date).getTime(); return d > 7 * 864e5 && d <= 21 * 864e5; }).length / 2;
  return Math.max(0, Math.min(1, 0.5 + (recent - previous) / Math.max(4, records.length)));
}

export function aggregateClusters(records) {
  const actionable = records.filter((r) => r.topicId !== 'noise');
  const maxDate = actionable.map((r) => r.date).filter(Boolean).sort().at(-1);
  const groups = Object.groupBy(actionable, (r) => r.topicId);
  const maxCount = Math.max(1, ...Object.values(groups).map((x) => x.length));
  return Object.entries(groups).map(([id, rs]) => {
    const topic = TOPICS.find((x) => x.id === id);
    const negative = rs.filter((r) => r.sentiment === '负面').length / rs.length;
    const volume = Math.log1p(rs.length) / Math.log1p(maxCount);
    const severityAvg = rs.reduce((n, r) => n + r.severity, 0) / rs.length / 2.4;
    const reach = Math.min(1, (new Set(rs.map((r) => r.channel)).size / 4) + Math.log1p(new Set(rs.map((r) => r.author)).size) / 12);
    const customer = rs.reduce((n, r) => n + (ROLE_WEIGHT[r.role] || 1), 0) / rs.length / 1.45;
    const trend = trendScore(rs, maxDate);
    const score = Math.round(100 * (0.28 * volume + 0.22 * negative + 0.18 * severityAvg + 0.12 * reach + 0.1 * trend + 0.1 * customer));
    const meta = ACTION_META[id] || { owner: id === 'feature' ? '产品团队' : '客户体验团队', status: '待分诊', action: id === 'feature' ? '与需求池查重后进入需求评估' : '抽样复核并确定责任团队', workaround: '无' };
    const reps = [...rs].sort((a, b) => b.signal - a.signal).slice(0, 3).map((r) => ({ id: r.id, text: r.text, channel: r.channel, sentiment: r.sentiment, likes: r.likes || 0, role: r.role }));
    return { id, topic: topic.label, count: rs.length, users: new Set(rs.map((r) => r.author)).size, channels: new Set(rs.map((r) => r.channel)).size, negativeRate: Math.round(negative * 100), avgSeverity: Number((severityAvg * 2.4).toFixed(2)), trend: Math.round((trend - 0.5) * 200), score, ...meta, representatives: reps };
  }).sort((a, b) => b.score - a.score);
}

function demandTokens(text) {
  const t = normalizeText(text);
  const dict = ['银行', '流水', '回单', '连续拍摄', '批量扫描', '发票验真', '人工校对', '英文合同', 'word', '异步回调', 'webhook', '团队', '子账号', '成员用量', '合并单元格', '医疗发票', '纠偏', '小程序批量', '保留一年', '自定义', '抽取模板', '身份证', '营业执照', '暗黑模式'];
  return new Set(dict.filter((x) => t.includes(x)));
}

export function matchBacklog(record, backlog) {
  const a = demandTokens(record.text);
  let best = null;
  for (const item of backlog || []) {
    const text = `${item['标题']} ${item['需求描述']}`;
    const b = demandTokens(text);
    const intersection = [...a].filter((x) => b.has(x)).length;
    let sim = intersection / Math.max(1, Math.min(a.size, b.size));
    const aliases = [
      [/银行回单|银行流水/, /银行回单|银行流水/], [/连续拍摄|批量扫描/, /连续拍摄|批量扫描/], [/团队子账号|成员用量/, /团队|子账号|成员用量/], [/主动回调|异步回调|webhook/, /回调|webhook/]
    ];
    for (const [x, y] of aliases) if (x.test(record.text) && y.test(text)) sim = Math.max(sim, 0.88);
    if (!best || sim > best.similarity) best = { id: item['需求ID'], title: item['标题'], status: item['状态'], priority: item['优先级'], similarity: Number(sim.toFixed(2)) };
  }
  return best && best.similarity >= 0.48 ? { ...best, decision: best.similarity >= 0.8 ? '关联已有需求' : '建议人工复核' } : { id: null, title: '未发现高相似需求', similarity: best?.similarity || 0, decision: '建议创建候选需求' };
}

const KB_REPLIES = {
  price: '您好，免费版每月包含100页额度。额度用完后，可在“个人中心 → 我的额度”升级个人版（29元/月，1500页），或购买100页/9.9元的加油包。',
  privacy: '您好，文件与识别结果默认保留90天，到期自动删除，也可在“识别历史”中手动删除。平台全程HTTPS加密传输，不会将客户文件用于模型训练（除非另有书面授权）。',
  api: '您好，HTTP 429表示触发调用限流：免费版为2 QPS，企业版默认10 QPS。建议降低调用频率；企业版可联系客服申请提升配额。',
  format: '您好，目前支持JPG、PNG、BMP和PDF，不支持HEIC；加密PDF需先解除密码。若您使用iPhone，可将相机格式改为“兼容性最佳”后重新上传。',
  batch: '您好，给您带来不便非常抱歉。当前网页版单批上限为50个文件、总量500MB。针对大批次上传超时，建议暂时拆分为每批20个以内，我们会持续跟进修复进展。',
  stamp: '您好，我们已关注到印章覆盖金额区域时可能出现误识别。为避免影响报销数据，请先人工核对盖章处金额字段；该问题会作为高优先级质量问题继续跟进。'
};

export function draftReply(record) {
  const base = KB_REPLIES[record.topicId];
  if (base) return base;
  if (record.feedbackType === '功能需求') return '您好，感谢您的建议。我们已记录具体使用场景，并会结合相似反馈、影响范围和现有需求规划进行评估；后续如有明确进展将及时同步。';
  if (record.sentiment === '正面') return '感谢您的认可！您的反馈对我们很重要，我们会继续提升识别准确性和处理体验。';
  return '您好，抱歉给您带来不便。为了进一步定位问题，请提供设备/系统版本、发生时间、文件类型及相关报错信息，我们会尽快核查。';
}

export function evaluate(records, annotations) {
  const byId = Object.fromEntries(records.map((r) => [r.id, r]));
  const pairs = (annotations || []).map((a) => ({ truthTopic: a['主题标签'], truthSentiment: a['情感标签'], pred: byId[a['评论ID']] })).filter((x) => x.pred);
  const accuracy = (key, truth) => pairs.length ? pairs.filter((p) => p.pred[key] === p[truth]).length / pairs.length : 0;
  function macroF1(key, truth) {
    const labels = [...new Set(pairs.map((p) => p[truth]))];
    return labels.reduce((sum, label) => {
      const tp = pairs.filter((p) => p.pred[key] === label && p[truth] === label).length;
      const fp = pairs.filter((p) => p.pred[key] === label && p[truth] !== label).length;
      const fn = pairs.filter((p) => p.pred[key] !== label && p[truth] === label).length;
      const precision = tp / Math.max(1, tp + fp), recall = tp / Math.max(1, tp + fn);
      return sum + (2 * precision * recall / Math.max(1e-9, precision + recall));
    }, 0) / Math.max(1, labels.length);
  }
  return { sampleSize: pairs.length, topicAccuracy: accuracy('topic', 'truthTopic'), topicMacroF1: macroF1('topic', 'truthTopic'), sentimentAccuracy: accuracy('sentiment', 'truthSentiment'), sentimentMacroF1: macroF1('sentiment', 'truthSentiment') };
}

export function buildDashboard(groups) {
  const raw = normalizeInputs(groups);
  const records = raw.map(analyzeRecord);
  const clusters = aggregateClusters(records);
  const backlog = groups.backlog || [];
  const actions = records.filter((r) => r.feedbackType === '功能需求' || (r.feedbackType.includes('问题') && r.signal > 2.2)).sort((a, b) => b.signal - a.signal).slice(0, 40).map((r) => ({ ...r, backlogMatch: matchBacklog(r, backlog), reply: draftReply(r) }));
  const positiveNames = { overall: '中文票据识别与整体效率', performance: '识别处理速度', field: '字段抽取准确性', api: 'API文档与集成体验', table: '表格识别与Excel导出' };
  const positive = records.filter((r) => r.sentiment === '正面' && positiveNames[r.topicId]).reduce((acc, r) => { const name = positiveNames[r.topicId]; acc[name] = (acc[name] || 0) + 1; return acc; }, {});
  return {
    generatedAt: new Date().toISOString(),
    summary: { total: records.length, actionable: records.filter((r) => r.topicId !== 'noise').length, noise: records.filter((r) => r.topicId === 'noise').length, negative: records.filter((r) => r.sentiment === '负面').length, pendingActions: actions.length },
    clusters,
    actions,
    positiveSignals: Object.entries(positive).map(([topic, count]) => ({ topic, count })).sort((a, b) => b.count - a.count).slice(0, 5),
    evaluation: evaluate(records, groups.annotations || []),
    referenceData: { backlog: groups.backlog || [], roles: groups.roles || [], annotations: groups.annotations || [] },
    records
  };
}
