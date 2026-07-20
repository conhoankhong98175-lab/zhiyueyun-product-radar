import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCsv, buildDashboard } from '../src/nlp-core.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const source = path.resolve(root, '..');
const files = [
  '01-反馈数据/应用商店评论.csv',
  '01-反馈数据/应用商店评论-标注子集.csv',
  '01-反馈数据/问题反馈表.csv',
  '01-反馈数据/需求登记表.csv',
  '反馈方角色表.csv',
  '需求池.csv'
];

const groups = {};
for (const relative of files) {
  const parsed = readCsv(await fs.readFile(path.join(source, relative), 'utf8'));
  groups[parsed.type] = parsed.rows;
}
const dashboard = buildDashboard(groups);
await fs.mkdir(path.join(root, 'public/data'), { recursive: true });
await fs.writeFile(path.join(root, 'public/data/dashboard.json'), JSON.stringify(dashboard), 'utf8');
await fs.copyFile(path.join(root, 'src/nlp-core.js'), path.join(root, 'public/nlp-core.js'));
await fs.copyFile(path.join(root, 'README.md'), path.join(root, 'public/README.md'));
await fs.copyFile(path.join(root, 'SOLUTION.md'), path.join(root, 'public/SOLUTION.md'));
await fs.copyFile(path.join(root, 'PROBLEM_DEFINITION.md'), path.join(root, 'public/PROBLEM_DEFINITION.md'));
await fs.copyFile(path.join(root, 'AI_SOLUTION.md'), path.join(root, 'public/AI_SOLUTION.md'));
await fs.copyFile(path.join(root, 'WORKFLOW.md'), path.join(root, 'public/WORKFLOW.md'));
await fs.cp(path.join(root, 'assets'), path.join(root, 'public/assets'), { recursive: true, force: true });
console.log(`已处理 ${dashboard.summary.total} 条反馈，形成 ${dashboard.clusters.length} 个主题，输出 ${dashboard.actions.length} 条候选行动。`);
console.log(`主题准确率 ${(dashboard.evaluation.topicAccuracy * 100).toFixed(1)}%，情感准确率 ${(dashboard.evaluation.sentimentAccuracy * 100).toFixed(1)}%。`);
