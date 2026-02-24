import React, { useState } from 'react';
import { Row, Col, Button, Space, Typography, Slider, Select } from 'antd';
import { KnowledgeCard, PageHeader } from '@/components/KnowledgeCard';

const { Text } = Typography;

// Demo: Flexbox
function FlexboxDemo() {
  const [justify, setJustify] = useState<string>('flex-start');
  const [align, setAlign] = useState<string>('stretch');

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Space wrap>
        <Space>
          <Text style={{ fontSize: 12 }}>justify-content:</Text>
          <Select
            size="small"
            value={justify}
            onChange={setJustify}
            style={{ width: 140 }}
            options={[
              { value: 'flex-start', label: 'flex-start' },
              { value: 'flex-end', label: 'flex-end' },
              { value: 'center', label: 'center' },
              { value: 'space-between', label: 'space-between' },
              { value: 'space-around', label: 'space-around' },
              { value: 'space-evenly', label: 'space-evenly' },
            ]}
          />
        </Space>
        <Space>
          <Text style={{ fontSize: 12 }}>align-items:</Text>
          <Select
            size="small"
            value={align}
            onChange={setAlign}
            style={{ width: 120 }}
            options={[
              { value: 'stretch', label: 'stretch' },
              { value: 'flex-start', label: 'flex-start' },
              { value: 'flex-end', label: 'flex-end' },
              { value: 'center', label: 'center' },
            ]}
          />
        </Space>
      </Space>
      <div
        style={{
          display: 'flex',
          justifyContent: justify as any,
          alignItems: align as any,
          height: 100,
          border: '2px dashed #1677ff',
          borderRadius: 8,
          padding: 8,
          gap: 8,
        }}
      >
        {['A', 'B', 'C'].map((item, i) => (
          <div
            key={item}
            style={{
              background: ['#1677ff', '#52c41a', '#ff4d4f'][i],
              color: '#fff',
              width: 50,
              height: i === 1 ? 60 : 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
              fontWeight: 'bold',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </Space>
  );
}

// Demo: Box Model
function BoxModelDemo() {
  const [padding, setPadding] = useState(16);
  const [margin, setMargin] = useState(8);
  const [border, setBorder] = useState(2);

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Space direction="vertical" size={2} style={{ width: '100%' }}>
        <Text style={{ fontSize: 12 }}>margin: {margin}px</Text>
        <Slider min={0} max={30} value={margin} onChange={setMargin} />
        <Text style={{ fontSize: 12 }}>border: {border}px</Text>
        <Slider min={0} max={10} value={border} onChange={setBorder} />
        <Text style={{ fontSize: 12 }}>padding: {padding}px</Text>
        <Slider min={0} max={40} value={padding} onChange={setPadding} />
      </Space>
      <div
        style={{
          margin: margin,
          border: `${border}px solid #1677ff`,
          padding: padding,
          background: '#e6f4ff',
          borderRadius: 4,
          textAlign: 'center',
          fontSize: 13,
        }}
      >
        <span style={{ background: '#bae0ff', padding: '4px 8px', borderRadius: 4 }}>
          content
        </span>
      </div>
      <Text type="secondary" style={{ fontSize: 12 }}>
        总宽度 = content + padding×2 + border×2 + margin×2
      </Text>
    </Space>
  );
}

// Demo: CSS Animation
function AnimationDemo() {
  const [animating, setAnimating] = useState(false);

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Button size="small" onClick={() => setAnimating((a) => !a)}>
        {animating ? '停止动画' : '启动动画'}
      </Button>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', height: 60 }}>
        <div
          style={{
            width: 50,
            height: 50,
            background: '#1677ff',
            borderRadius: '50%',
            animation: animating ? 'bounce 0.8s infinite alternate' : 'none',
          }}
        />
        <div
          style={{
            width: 50,
            height: 50,
            background: '#52c41a',
            borderRadius: 8,
            animation: animating ? 'spin 1.2s linear infinite' : 'none',
          }}
        />
        <div
          style={{
            width: 50,
            height: 50,
            background: '#ff4d4f',
            animation: animating ? 'pulse 1s ease-in-out infinite' : 'none',
          }}
        />
      </div>
      <style>{`
        @keyframes bounce { to { transform: translateY(-20px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>
    </Space>
  );
}

const cssKnowledge = [
  {
    title: '盒模型 (Box Model)',
    tags: ['基础', '布局'],
    description:
      'CSS 盒模型描述了元素所占的空间，由 content（内容）、padding（内边距）、border（边框）、margin（外边距）组成。box-sizing: content-box（默认，width 只含 content）vs border-box（width 含 content + padding + border，更直观）。',
    demo: <BoxModelDemo />,
    code: `/* 推荐全局设置 border-box */
*, *::before, *::after {
  box-sizing: border-box;
}

.box {
  width: 200px;      /* 实际宽度 200px（含 padding 和 border） */
  padding: 16px;
  border: 2px solid #ccc;
  margin: 8px;
}`,
  },
  {
    title: 'Flexbox 弹性布局',
    tags: ['布局', 'CSS3'],
    description:
      'Flexbox 是一维布局方案，适合在单行或单列中分配空间。父容器设置 display: flex，通过 justify-content（主轴对齐）、align-items（交叉轴对齐）、flex-wrap（换行）等属性控制布局。子元素通过 flex-grow、flex-shrink、flex-basis 控制伸缩。',
    demo: <FlexboxDemo />,
    code: `.container {
  display: flex;
  justify-content: space-between; /* 主轴对齐 */
  align-items: center;            /* 交叉轴对齐 */
  flex-wrap: wrap;                /* 允许换行 */
  gap: 16px;
}

.item {
  flex: 1 1 200px; /* grow shrink basis */
}`,
  },
  {
    title: 'CSS Grid 网格布局',
    tags: ['布局', 'CSS3'],
    description:
      'Grid 是二维布局方案，可同时控制行和列。通过 grid-template-columns/rows 定义网格结构，grid-area 或 grid-column/row 定位元素。fr 单位表示剩余空间的比例，repeat() 简化重复定义。',
    code: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 列等宽 */
  grid-template-rows: auto;
  gap: 16px;
}

/* 实现经典圣杯布局 */
.layout {
  display: grid;
  grid-template:
    "header header header" 64px
    "aside  main   aside2" 1fr
    "footer footer footer" 48px
    / 200px 1fr 200px;
}
.header { grid-area: header; }
.main   { grid-area: main; }`,
  },
  {
    title: 'BFC 块级格式化上下文',
    tags: ['布局', '核心概念'],
    description:
      'BFC（Block Formatting Context）是一个独立的渲染区域，内部元素不影响外部。触发 BFC：overflow（非 visible）、float、position（absolute/fixed）、display（inline-block/flex/grid）。BFC 用途：清除浮动、防止 margin 折叠、阻止文字环绕。',
    code: `/* 触发 BFC 的常用方式 */
.bfc-overflow  { overflow: hidden; }
.bfc-flex      { display: flex; }
.bfc-inline    { display: inline-block; }
.bfc-absolute  { position: absolute; }

/* 利用 BFC 清除浮动（替代 clearfix） */
.parent {
  overflow: hidden; /* 触发 BFC，包含浮动子元素 */
}

/* 防止 margin 折叠 */
.wrapper {
  overflow: hidden; /* 触发 BFC，内外 margin 不折叠 */
}`,
  },
  {
    title: 'CSS 动画',
    tags: ['动画', 'CSS3'],
    description:
      'CSS 提供两种动画方式：transition（过渡，在两个状态之间平滑过渡）和 animation（关键帧动画，@keyframes 定义复杂动画）。优先使用 transform 和 opacity 属性，它们在合成层上执行，不触发重排重绘，性能最好。',
    demo: <AnimationDemo />,
    code: `/* 过渡动画 */
.btn {
  transition: transform 0.2s ease, background 0.2s;
}
.btn:hover {
  transform: scale(1.05);
  background: #0958d9;
}

/* 关键帧动画 */
@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.appear {
  animation: slideIn 0.4s ease-out forwards;
}`,
  },
  {
    title: '响应式设计 & 媒体查询',
    tags: ['响应式', '移动端'],
    description:
      '响应式设计让页面在不同屏幕尺寸下都有良好体验。核心手段：媒体查询（@media）、相对单位（rem/em/%/vw/vh）、弹性布局（Flex/Grid）、移动端 viewport 设置。CSS 变量（--var）可以在媒体查询中动态改变主题尺寸。',
    code: `/* 移动优先策略 */
.container {
  padding: 16px;  /* 移动端默认 */
}

@media (min-width: 768px) {
  .container { padding: 24px; } /* 平板 */
}

@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px;             /* 桌面 */
  }
}

/* 使用 CSS 变量 */
:root {
  --spacing: 16px;
  --font-size: 14px;
}
@media (min-width: 768px) {
  :root { --spacing: 24px; --font-size: 16px; }
}`,
  },
];

export default function CSSPage() {
  return (
    <div>
      <PageHeader
        icon="🎨"
        title="CSS 知识点"
        description="CSS 负责网页的视觉呈现，深入理解布局、盒模型、动画等概念是构建精美界面的关键。"
        color="#264de4"
      />
      <Row>
        <Col span={24}>
          {cssKnowledge.map((item, index) => (
            <KnowledgeCard key={index} item={item} />
          ))}
        </Col>
      </Row>
    </div>
  );
}
