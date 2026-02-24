import React, { useState } from 'react';
import { Row, Col, Button, Space, Typography, Timeline, Tag } from 'antd';
import { KnowledgeCard, PageHeader } from '@/components/KnowledgeCard';

const { Text } = Typography;

// Demo: Event Loop visualization
function EventLoopVisual() {
  const [step, setStep] = useState(-1);

  const steps = [
    { label: '1. 执行同步代码：console.log("start")', type: 'sync' },
    { label: '2. setTimeout 回调入宏任务队列（等待）', type: 'macro' },
    { label: '3. Promise.then 回调入微任务队列（等待）', type: 'micro' },
    { label: '4. 执行同步代码：console.log("end")', type: 'sync' },
    { label: '5. 清空微任务队列：Promise.then 执行', type: 'micro' },
    { label: '6. 下一轮宏任务：setTimeout 回调执行', type: 'macro' },
  ];

  const colorMap = { sync: '#1677ff', micro: '#52c41a', macro: '#ff4d4f' };
  const labelMap = { sync: '同步', micro: '微任务', macro: '宏任务' };

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Space>
        <Button size="small" type="primary" onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}>
          下一步
        </Button>
        <Button size="small" onClick={() => setStep(-1)}>重置</Button>
      </Space>
      <div>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              padding: '6px 12px',
              margin: '4px 0',
              borderRadius: 6,
              background: i <= step ? `${colorMap[s.type]}15` : '#f5f5f5',
              border: `1px solid ${i <= step ? colorMap[s.type] : '#d9d9d9'}`,
              opacity: i > step ? 0.5 : 1,
              transition: 'all 0.3s',
            }}
          >
            <Tag color={i <= step ? colorMap[s.type] : 'default'} style={{ marginRight: 8 }}>
              {labelMap[s.type]}
            </Tag>
            <Text style={{ fontSize: 12 }}>{s.label}</Text>
          </div>
        ))}
      </div>
    </Space>
  );
}

// Demo: Browser Render Pipeline
function RenderPipelineDemo() {
  const stages = [
    { name: 'Parse HTML', desc: '解析 HTML 构建 DOM 树', color: '#1677ff' },
    { name: 'Parse CSS', desc: '解析 CSS 构建 CSSOM', color: '#52c41a' },
    { name: 'Style', desc: '合并 DOM + CSSOM 生成渲染树', color: '#722ed1' },
    { name: 'Layout', desc: '计算元素位置和尺寸（重排）', color: '#fa8c16' },
    { name: 'Paint', desc: '绘制像素到图层（重绘）', color: '#f5222d' },
    { name: 'Composite', desc: '合并图层显示到屏幕', color: '#13c2c2' },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
      {stages.map((stage, i) => (
        <React.Fragment key={stage.name}>
          <div
            style={{
              background: `${stage.color}15`,
              border: `1px solid ${stage.color}60`,
              borderRadius: 8,
              padding: '8px 12px',
              textAlign: 'center',
              minWidth: 90,
            }}
          >
            <div style={{ color: stage.color, fontWeight: 600, fontSize: 12 }}>{stage.name}</div>
            <div style={{ color: '#595959', fontSize: 11, marginTop: 2 }}>{stage.desc}</div>
          </div>
          {i < stages.length - 1 && (
            <Text style={{ fontSize: 16, color: '#8c8c8c' }}>→</Text>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const browserKnowledge = [
  {
    title: '浏览器渲染流程',
    tags: ['渲染原理', '性能'],
    description:
      '浏览器将 HTML/CSS/JS 渲染为页面的完整流程：解析 HTML→构建 DOM；解析 CSS→构建 CSSOM；合并→渲染树；Layout（计算位置尺寸）；Paint（绘制像素）；Composite（合成图层）。重排（Reflow）影响布局，开销大；重绘（Repaint）只影响外观；合成层操作（transform/opacity）最高效。',
    demo: <RenderPipelineDemo />,
    code: `// 避免频繁触发重排
// ❌ 多次读写，触发强制同步布局
for (let el of elements) {
  el.style.width = el.offsetWidth + 10 + 'px'; // 读后写
}

// ✅ 批量读取后批量写入
const widths = elements.map(el => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';
});

// 使用 transform 代替 top/left（不触发重排）
.moving { transform: translateX(100px); }`,
  },
  {
    title: '事件循环 (Event Loop)',
    tags: ['运行机制', '异步'],
    description:
      '浏览器的事件循环负责协调主线程的任务执行。宏任务（Task）：setTimeout、setInterval、I/O、requestAnimationFrame。微任务（Microtask）：Promise.then、queueMicrotask、MutationObserver。每个宏任务执行完后，清空全部微任务，再执行下一个宏任务。',
    demo: <EventLoopVisual />,
    code: `console.log('start');          // 同步

setTimeout(() => {
  console.log('timeout');        // 宏任务
}, 0);

Promise.resolve()
  .then(() => console.log('promise')); // 微任务

console.log('end');              // 同步

// 输出：start → end → promise → timeout`,
  },
  {
    title: '浏览器存储',
    tags: ['存储', '缓存'],
    description:
      'Cookie：可设过期时间，随请求自动发送（httpOnly 防 XSS），约 4KB。localStorage：持久存储，同源共享，约 5MB。sessionStorage：会话级，标签页关闭即清除。IndexedDB：异步、事务性，可存大量结构化数据。Cache API：Service Worker 配合使用，缓存网络请求。',
    code: `// Cookie（推荐用库如 js-cookie）
document.cookie = 'token=abc; Secure; SameSite=Strict; max-age=3600';

// localStorage
localStorage.setItem('user', JSON.stringify(user));
const user = JSON.parse(localStorage.getItem('user') ?? 'null');

// sessionStorage（同 localStorage 但会话级）
sessionStorage.setItem('draft', content);

// IndexedDB（用 idb 库简化）
import { openDB } from 'idb';
const db = await openDB('myDB', 1, {
  upgrade(db) { db.createObjectStore('notes', { keyPath: 'id' }); },
});
await db.put('notes', { id: 1, text: 'Hello' });`,
  },
  {
    title: '浏览器安全：XSS & CSRF',
    tags: ['安全', '前端安全'],
    description:
      'XSS（跨站脚本攻击）：注入恶意脚本。防御：转义输出、CSP、httpOnly Cookie、避免 innerHTML 注入用户内容。CSRF（跨站请求伪造）：诱导用户发送请求。防御：CSRF Token、SameSite Cookie、Referer 验证、二次确认。',
    code: `// XSS 防御 - 转义用户输入
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 设置 CSP（Content-Security-Policy）
// HTTP Header:
// Content-Security-Policy: default-src 'self'; script-src 'self'

// CSRF Token
fetch('/api/delete', {
  method: 'POST',
  headers: { 'X-CSRF-Token': getCsrfToken() },
});

// SameSite Cookie
Set-Cookie: session=abc; SameSite=Strict; Secure`,
  },
  {
    title: 'HTTP 缓存策略',
    tags: ['缓存', '性能'],
    description:
      '强缓存（不发请求）：Cache-Control: max-age / Expires。协商缓存（发请求验证）：ETag / Last-Modified。最佳实践：HTML 用协商缓存，JS/CSS 文件名加 hash 用强缓存，API 用 no-store 或短 max-age。Service Worker 可实现灵活的离线缓存。',
    code: `// 强缓存（1年，适合带 hash 的静态资源）
Cache-Control: max-age=31536000, immutable

// 协商缓存（适合 HTML）
Cache-Control: no-cache
ETag: "abc123"  // 响应头
If-None-Match: "abc123"  // 请求头，匹配则返回 304

// 禁止缓存（API 接口）
Cache-Control: no-store

// Service Worker 离线缓存
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached ?? fetch(event.request)
    )
  );
});`,
  },
];

export default function BrowserPage() {
  return (
    <div>
      <PageHeader
        icon="🌐"
        title="浏览器原理"
        description="理解浏览器的渲染流程、事件循环、存储机制和安全策略，是优化前端性能和编写安全代码的基础。"
        color="#4285f4"
      />
      <Row>
        <Col span={24}>
          {browserKnowledge.map((item, index) => (
            <KnowledgeCard key={index} item={item} />
          ))}
        </Col>
      </Row>
    </div>
  );
}
