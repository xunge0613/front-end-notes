import React from 'react';
import { Row, Col, Typography, Progress, Space } from 'antd';
import { KnowledgeCard, PageHeader } from '@/components/KnowledgeCard';

const { Text } = Typography;

// Demo: Core Web Vitals visualization
function CoreWebVitalsDemo() {
  const metrics = [
    { name: 'LCP', full: 'Largest Contentful Paint', value: 1.8, good: 2.5, unit: 's', desc: '最大内容绘制' },
    { name: 'FID', full: 'First Input Delay', value: 45, good: 100, unit: 'ms', desc: '首次输入延迟' },
    { name: 'CLS', full: 'Cumulative Layout Shift', value: 0.05, good: 0.1, unit: '', desc: '累积布局偏移' },
    { name: 'INP', full: 'Interaction to Next Paint', value: 120, good: 200, unit: 'ms', desc: '交互响应延迟' },
    { name: 'TTFB', full: 'Time to First Byte', value: 380, good: 800, unit: 'ms', desc: '首字节时间' },
  ];

  return (
    <Space direction="vertical" size={8} style={{ width: '100%' }}>
      {metrics.map((m) => {
        const percent = Math.min((m.value / (m.good * 1.5)) * 100, 100);
        const isGood = m.value <= m.good;
        return (
          <div key={m.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <Text style={{ fontSize: 12 }}>
                <Text strong>{m.name}</Text> ({m.desc})
              </Text>
              <Text
                style={{ fontSize: 12, color: isGood ? '#52c41a' : '#fa8c16' }}
              >
                {m.value}{m.unit} {isGood ? '✅ 优秀' : '⚠️ 需改进'}
              </Text>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={isGood ? '#52c41a' : '#fa8c16'}
              size="small"
            />
          </div>
        );
      })}
    </Space>
  );
}

const performanceKnowledge = [
  {
    title: 'Core Web Vitals（核心性能指标）',
    tags: ['性能指标', 'Google'],
    description:
      'Google 定义的核心用户体验指标：LCP（最大内容绘制，<2.5s 优秀）衡量加载性能；FID/INP（交互延迟，FID<100ms、INP<200ms）衡量交互响应性；CLS（累积布局偏移，<0.1 优秀）衡量视觉稳定性。这些指标直接影响 Google 搜索排名。',
    demo: <CoreWebVitalsDemo />,
    code: `// 使用 web-vitals 库采集指标
import { onLCP, onFID, onCLS, onINP, onTTFB } from 'web-vitals';

function sendToAnalytics({ name, value, id }) {
  fetch('/analytics', {
    method: 'POST',
    body: JSON.stringify({ name, value, id }),
  });
}

onLCP(sendToAnalytics);
onFID(sendToAnalytics);
onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onTTFB(sendToAnalytics);`,
  },
  {
    title: '资源加载优化',
    tags: ['加载优化', '网络'],
    description:
      '1. 减少请求数：合并文件、CSS Sprite、内联小图片（base64）；2. 减少传输量：Gzip/Brotli 压缩、图片压缩（WebP/AVIF）、Tree Shaking；3. 加速传输：CDN、HTTP/2 多路复用、预连接（preconnect）；4. 智能预加载：preload 关键资源、prefetch 未来资源、懒加载非关键资源。',
    code: `<!-- 关键资源预加载 -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero.webp" as="image" fetchpriority="high">

<!-- DNS 预解析 & 预连接 -->
<link rel="dns-prefetch" href="//cdn.example.com">
<link rel="preconnect" href="https://api.example.com">

<!-- 非关键脚本延迟加载 -->
<script src="analytics.js" defer></script>
<script src="chat.js" async></script>

<!-- 图片懒加载（原生） -->
<img src="photo.webp" loading="lazy" alt="...">

<!-- 使用现代图片格式 -->
<picture>
  <source srcset="img.avif" type="image/avif">
  <source srcset="img.webp" type="image/webp">
  <img src="img.jpg" alt="...">
</picture>`,
  },
  {
    title: '代码分割 & 懒加载',
    tags: ['打包优化', 'Webpack'],
    description:
      '代码分割将大 Bundle 拆分为按需加载的小 Chunk，减少初始加载时间。动态 import() 实现路由级懒加载；React.lazy + Suspense 实现组件级懒加载。Webpack 的 SplitChunksPlugin 自动提取公共模块。分析工具：webpack-bundle-analyzer 可视化 Bundle 大小。',
    code: `// React 路由懒加载
import { lazy, Suspense } from 'react';
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>

// 动态导入（按需加载模块）
const { exportData } = await import('./utils/export');
exportData(list);

// Webpack SplitChunks 配置
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendors',
          priority: 10,
        },
      },
    },
  },
};`,
  },
  {
    title: '运行时性能优化',
    tags: ['运行时', '渲染'],
    description:
      '避免重排重绘：用 transform/opacity 替代 top/left/width；批量 DOM 操作用 DocumentFragment；用 will-change 提示浏览器创建合成层。长任务优化：用 Web Worker 处理 CPU 密集型任务；时间切片（requestAnimationFrame/scheduler）避免阻塞主线程。虚拟列表（Virtual List）处理大数据渲染。',
    code: `// 虚拟列表（react-virtualized / react-window）
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>Item {index}</div>
);

// 只渲染可见区域的 item，即使有 100000 条数据
<FixedSizeList height={500} itemCount={100000} itemSize={35}>
  {Row}
</FixedSizeList>

// Web Worker 处理重计算
const worker = new Worker('./heavy-compute.worker.js');
worker.postMessage({ data: bigArray });
worker.onmessage = ({ data }) => setResult(data);

// 时间切片（React 18 / scheduler）
import { scheduleCallback, NormalPriority } from 'scheduler';
scheduleCallback(NormalPriority, () => processChunk());`,
  },
  {
    title: 'Tree Shaking & 打包优化',
    tags: ['打包优化', 'ES Module'],
    description:
      'Tree Shaking 通过静态分析 ES Module 的导入导出，删除未使用的代码。前提：使用 ESM 语法（import/export）；依赖包提供 ESM 格式。打包优化策略：精准引入按需加载（antd/lodash）；外部化大依赖（CDN）；分析并减少 Bundle 大小；启用 Brotli/Gzip 压缩。',
    code: `// 按需引入（减少打包体积）
// ❌ 引入全量 lodash（~70KB gzip）
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ 只引入需要的函数（~2KB）
import debounce from 'lodash-es/debounce';

// ✅ antd 按需引入（v5 默认支持 Tree Shaking）
import { Button, Input } from 'antd';

// vite.config.ts - 分析 Bundle
import { visualizer } from 'rollup-plugin-visualizer';
export default {
  plugins: [visualizer({ open: true })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: { 'react-vendor': ['react', 'react-dom'] },
      },
    },
  },
};`,
  },
  {
    title: '图片优化',
    tags: ['资源优化', '图片'],
    description:
      '选择合适格式：AVIF（最优，兼容性差）> WebP（好，现代浏览器全支持）> JPEG（照片）> PNG（透明/线条图）> SVG（图标/矢量）。优化手段：响应式图片（srcset/sizes）、懒加载（loading="lazy" 或 IntersectionObserver）、CDN 图片变换（OSS/七牛自动转格式和尺寸）、关键图片预加载（fetchpriority="high"）。',
    code: `<!-- 响应式图片 -->
<img
  srcset="small.webp 480w, medium.webp 800w, large.webp 1200w"
  sizes="(max-width: 600px) 480px, (max-width: 1000px) 800px, 1200px"
  src="medium.webp"
  loading="lazy"
  alt="description"
>

// 基于 IntersectionObserver 的懒加载
const observer = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) {
      target.src = target.dataset.src;
      observer.unobserve(target);
    }
  });
}, { rootMargin: '100px' });

document.querySelectorAll('img[data-src]')
  .forEach(img => observer.observe(img));`,
  },
];

export default function PerformancePage() {
  return (
    <div>
      <PageHeader
        icon="🚀"
        title="性能优化"
        description="前端性能优化涵盖网络、渲染、运行时等多个层面，合理优化可显著提升用户体验和搜索引擎排名。"
        color="#e17055"
      />
      <Row>
        <Col span={24}>
          {performanceKnowledge.map((item, index) => (
            <KnowledgeCard key={index} item={item} />
          ))}
        </Col>
      </Row>
    </div>
  );
}
