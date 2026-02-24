import React, { useState } from 'react';
import { Row, Col, Space, Typography, Tag, Steps } from 'antd';
import { KnowledgeCard, PageHeader } from '@/components/KnowledgeCard';

const { Text } = Typography;

// Demo: HTTP Status Codes
function HttpStatusDemo() {
  const codes = [
    { code: 200, text: 'OK', color: '#52c41a', desc: '请求成功' },
    { code: 301, text: 'Moved Permanently', color: '#fa8c16', desc: '永久重定向' },
    { code: 304, text: 'Not Modified', color: '#1677ff', desc: '协商缓存命中' },
    { code: 401, text: 'Unauthorized', color: '#f5222d', desc: '未认证' },
    { code: 403, text: 'Forbidden', color: '#f5222d', desc: '无权限' },
    { code: 404, text: 'Not Found', color: '#f5222d', desc: '资源不存在' },
    { code: 500, text: 'Internal Server Error', color: '#722ed1', desc: '服务器错误' },
    { code: 502, text: 'Bad Gateway', color: '#722ed1', desc: '网关错误' },
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {codes.map((c) => (
        <div
          key={c.code}
          style={{
            border: `1px solid ${c.color}40`,
            borderRadius: 8,
            padding: '8px 12px',
            background: `${c.color}10`,
            minWidth: 130,
          }}
        >
          <div>
            <Tag color={c.color} style={{ marginBottom: 4 }}>
              {c.code}
            </Tag>
          </div>
          <Text style={{ fontSize: 12, color: '#434343' }}>{c.desc}</Text>
        </div>
      ))}
    </div>
  );
}

// Demo: HTTPS Handshake Steps
function HttpsHandshakeDemo() {
  const steps = [
    { title: 'Client Hello', description: '客户端发送支持的 TLS 版本、加密套件列表和随机数（Client Random）' },
    { title: 'Server Hello', description: '服务端选择加密套件，发送证书（含公钥）和随机数（Server Random）' },
    { title: '证书验证', description: '客户端验证证书有效性（CA 链、域名、有效期），生成 Pre-master Secret' },
    { title: '密钥交换', description: '用服务端公钥加密 Pre-master Secret 发给服务端' },
    { title: '生成会话密钥', description: '双方用 Client Random + Server Random + Pre-master Secret 生成对称会话密钥' },
    { title: '加密通信', description: '后续通信使用对称密钥加密，兼顾安全性与性能' },
  ];

  return (
    <Steps
      direction="vertical"
      size="small"
      current={steps.length}
      items={steps.map((s) => ({ title: s.title, description: s.description }))}
    />
  );
}

const networkKnowledge = [
  {
    title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3',
    tags: ['HTTP', '协议演进'],
    description:
      'HTTP/1.1：持久连接（Keep-Alive），但存在队头阻塞（一个请求阻塞后续）。HTTP/2：多路复用（同一连接并发多请求）、头部压缩（HPACK）、服务端推送、二进制帧格式。HTTP/3：基于 QUIC（UDP），解决 TCP 层队头阻塞，0-RTT 快速恢复连接。',
    code: `HTTP/1.1 问题：
  - 队头阻塞：前一请求未完成，后续请求被阻塞
  - 每次请求携带完整 Header（冗余）
  - 最多 6 个并发连接（浏览器限制）

HTTP/2 解决方案：
  - 二进制分帧：数据分割为帧，乱序传输后重组
  - 多路复用：同一 TCP 连接并发 N 个请求
  - 头部压缩：HPACK 算法，差量编码
  - 流优先级：重要资源先加载

HTTP/3（QUIC over UDP）：
  - 独立流：一个流丢包不影响其他流
  - 连接迁移：网络切换不中断（如 WiFi→4G）
  - 0-RTT：已知服务器可跳过握手`,
  },
  {
    title: 'HTTPS & TLS 握手',
    tags: ['HTTPS', 'TLS', '安全'],
    description:
      'HTTPS = HTTP + TLS。TLS 握手建立加密通道：非对称加密交换密钥（安全但慢），之后用对称加密传输数据（快）。TLS 1.3 将握手从 2 个往返缩减到 1 个，大幅提升性能。证书由 CA（证书颁发机构）签发，确保服务端身份可信。',
    demo: <HttpsHandshakeDemo />,
    code: `// 前端配置 HTTPS 相关 Header
Strict-Transport-Security: max-age=31536000; includeSubDomains
// 强制所有请求走 HTTPS

Content-Security-Policy: upgrade-insecure-requests
// 自动将 HTTP 资源升级为 HTTPS

// 检查证书信息（Node.js）
const tls = require('tls');
const socket = tls.connect(443, 'example.com', {}, () => {
  const cert = socket.getPeerCertificate();
  console.log(cert.subject, cert.valid_to);
});`,
  },
  {
    title: 'HTTP 状态码',
    tags: ['HTTP', '基础'],
    description:
      '2xx 成功：200 OK、201 Created、204 No Content。3xx 重定向：301 永久重定向、302 临时重定向、304 Not Modified（协商缓存命中）。4xx 客户端错误：400 Bad Request、401 未认证、403 无权限、404 未找到。5xx 服务端错误：500 内部错误、502 网关错误、503 服务不可用。',
    demo: <HttpStatusDemo />,
  },
  {
    title: '跨域 (CORS)',
    tags: ['跨域', '安全'],
    description:
      '同源策略限制了不同源（协议+域名+端口）之间的资源共享。CORS（跨源资源共享）是标准解决方案：简单请求直接发送；预检请求（OPTIONS）先询问服务端是否允许。其他方案：JSONP（只支持 GET）、反向代理（Nginx 转发）。',
    code: `// 服务端设置 CORS 响应头（Node.js/Express）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://yourdomain.com');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// 前端发送跨域请求（带凭证）
fetch('https://api.example.com/data', {
  credentials: 'include', // 携带 Cookie
});

// Nginx 反向代理（避免跨域）
location /api/ {
  proxy_pass http://backend:3000/;
}`,
  },
  {
    title: 'WebSocket & 实时通信',
    tags: ['WebSocket', '实时'],
    description:
      'WebSocket 在单个 TCP 连接上提供全双工通信，低延迟、低开销。与 HTTP 轮询相比，服务端可主动推送数据。握手阶段使用 HTTP Upgrade 升级协议，之后通过帧传输数据。适用场景：聊天、实时数据（股票/地图）、多人游戏、协同编辑。Server-Sent Events（SSE）是轻量单向推送的替代方案。',
    code: `// 客户端
const ws = new WebSocket('wss://api.example.com/ws');

ws.onopen = () => {
  console.log('连接建立');
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'prices' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateUI(data);
};

ws.onclose = (event) => {
  console.log('连接关闭', event.code);
  // 断线重连
  setTimeout(connect, 3000);
};

// Server-Sent Events（单向推送）
const sse = new EventSource('/api/stream');
sse.addEventListener('update', e => updateUI(JSON.parse(e.data)));`,
  },
];

export default function NetworkPage() {
  return (
    <div>
      <PageHeader
        icon="☁️"
        title="网络协议"
        description="HTTP、HTTPS、WebSocket 等网络协议是前端与服务端通信的基础，理解其工作原理有助于调试和优化网络请求。"
        color="#00b894"
      />
      <Row>
        <Col span={24}>
          {networkKnowledge.map((item, index) => (
            <KnowledgeCard key={index} item={item} />
          ))}
        </Col>
      </Row>
    </div>
  );
}
