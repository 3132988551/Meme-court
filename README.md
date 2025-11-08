# 在线体验

体验版: https://meme-court.vercel.app/
生成不出来可能是因为的apikey欠费了

# Meme法庭 · Meme Court

前端单页应用（React + TypeScript + Tailwind CSS）。用户输入辩论主题后，自动生成检察官与辩护人三轮交锋，并由法官给出判决与金句总结。纸片卡通风 UI。

## 开发

需要 Node.js 18+。开发端口：5175。

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
npm run preview
```

## 设计要点

- 背景：奶白/米黄 (`#FFFDF8/#FFF8E8`)
- 角色配色：
  - 检察官：粉 `#FFB5C2`，深红描边 `#C63E4A`
  - 辩护人：湖蓝 `#A6D8FF`，深蓝描边 `#3178C6`
  - 法官：明黄 `#FFE577`，橙色描边 `#E49D3B`
- 黑色描边：所有卡片、气泡、按钮均 `1.5px` 黑边，并带“纸片”投影。
- 组件：`CaseHeader`（输入与开始）、`DebateStage`（聊天框逐句展示，含法官总结）、`RoleBubble`（角色气泡）、`Toolbar`（新开/复制）。

## 功能流程

1. 输入主题并点击“开始辩论”。
2. 三轮辩论按 0.5s 间隔逐步显现。
3. 自动生成法官总结（3 条金句 + 判决口号）。
4. 底部工具栏可“开始新辩论”或“复制文本”。

### 聊天框 + 逐句/自动
- 检察官左侧，辩护人右侧。
- 可滚动回看历史；点击对话区域或按空格键：弹出下一句。
- 工具栏中可切换“自动模式”，自动每 1.5s 播放下一句。

## 语言

已改为中文单语界面，无 i18n 依赖。

## 复制分享

点击“复制文本”将把本次辩论整理为纯文本（标题、每轮双方发言、总结与判决）。

## 生成逻辑
仅在线：`src/ai/generator.ts` 通过 DeepSeek Chat Completions 一次性生成 3 轮 + 法官总结（严格 JSON）。无本地回退。

输出结构固定：
```
{
  rounds: [ { prosecutor, defender }, ... x3 ],
  summary: { verdict: 'guilty'|'not_guilty'|'hung', lines: string[3], slogan: string }
}
```

### 人设提示词放置位置
- `src/ai/personas.ts`：包含 `ProsecutorPersona` / `DefenderPersona` / `JudgePersona` 的中文占位符。把你的人设提示词粘贴覆盖即可。

## 适配

通过 Tailwind 的响应式类自动适配移动端与桌面端布局。头像 + 气泡布局在窄屏下纵向堆叠，宽屏保持舒适留白。
