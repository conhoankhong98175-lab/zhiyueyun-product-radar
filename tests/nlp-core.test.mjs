import test from 'node:test';
import assert from 'node:assert/strict';
import { readCsv, classifyTopic, analyzeSentiment, isNoise, matchBacklog } from '../src/nlp-core.js';

test('识别反讽五星为负面弹窗反馈', () => {
  const text = '太棒了，每天打开软件先做三道关闭弹窗小游戏，提神醒脑，五星';
  assert.equal(classifyTopic(text).label, '产品体验-广告弹窗');
  assert.equal(analyzeSentiment(text, 5).label, '负面');
});

test('识别印章遮挡主题', () => assert.equal(classifyTopic('印章盖住价税合计，8600识别成3600').label, '识别准确性-印章遮挡'));
test('过滤刷评噪声', () => assert.equal(isNoise('互赞互评，评完扣1'), true));

test('修复问题反馈表中的未转义逗号', () => {
  const csv = '反馈日期,客户/用户,联系方式,问题描述,客服备注,紧急程度\n2026-01-01,用户,,"识别失败,请修复",已安抚,承诺跟进,高';
  const parsed = readCsv(csv);
  assert.equal(parsed.rows[0]['客服备注'], '已安抚，承诺跟进');
  assert.equal(parsed.rows[0]['紧急程度'], '高');
});

test('需求语义查重可关联主动回调', () => {
  const result = matchBacklog({ text: 'API做完能不能主动回调通知' }, [{ 需求ID: 'REQ-007', 标题: 'API支持异步回调', 需求描述: '支持webhook回调', 状态: '已排期', 优先级: 'P2' }]);
  assert.equal(result.id, 'REQ-007');
});
