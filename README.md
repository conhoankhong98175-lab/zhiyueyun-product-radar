# 智阅云 · 产品雷达

一个完全基于本地 CSV 的反馈智能分诊与产品洞察网页。项目不上传数据、不依赖数据库，也不需要安装第三方包。

在线演示：[智阅云产品雷达](https://conhoankhong98175-lab.github.io/zhiyueyun-product-radar/)

## 快速运行

```powershell
cd C:\Users\kang_gao\Downloads\problem-1-学员包\problem-1-学员包\product-radar
npm run build:data
npm start
```

浏览器打开 `http://127.0.0.1:4173`。

## 支持的 CSV

- 应用商店评论：评论ID、日期、平台、评分、昵称、评论内容、点赞数、开发者回复
- 客服问题反馈表：反馈日期、客户/用户、问题描述、客服备注、紧急程度
- 销售需求登记：登记日期、客户名称、需求概述、背景/预期价值、期望时间
- 需求池：需求ID、标题、描述、状态、优先级
- 反馈方角色表：昵称/显示名、角色、组织、客户等级
- 人工标注子集：评论ID、主题标签、情感标签

网页右上角支持一次选择一个或多个 CSV。文件类型按表头自动判断，全部分析在浏览器本地完成。

## 页面

- 洞察总览：核心指标、高频信号、正面卖点、建议先改的 Top 3
- 问题聚类：规模、负面率、趋势、优先分、代表证据及行动建议
- 反馈明细：原始反馈、反馈类型、主题、情感和信号强度，可搜索筛选
- 行动中心：高优 Bug、关联已有需求和候选新需求
- 模型评估：主题准确率、主题/情感 Macro-F1 和人工审核边界

## 常用命令

```powershell
npm run build:data  # 从上级学员包读取CSV并更新看板数据
npm test            # 执行规则、脏数据修复和需求查重测试
npm start           # 启动本地网页
```

详细设计见 [SOLUTION.md](./SOLUTION.md)。

## 补充交付文档

- [问题定义](./PROBLEM_DEFINITION.md)
- [AI Solution（含信息图）](./AI_SOLUTION.md)
- [Workflow](./WORKFLOW.md)
