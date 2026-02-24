import React from 'react';
import { Link } from 'umi';
import { Card, Row, Col, Typography, Tag, Statistic } from 'antd';
import {
  CodeOutlined,
  BgColorsOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CloudOutlined,
  RocketOutlined,
  ReadOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import styles from './index.less';

const { Title, Paragraph } = Typography;

const topics = [
  {
    key: 'javascript',
    path: '/javascript',
    icon: <CodeOutlined />,
    title: 'JavaScript',
    description: '闭包、原型链、异步编程、ES6+等核心知识点',
    color: '#f7df1e',
    textColor: '#262626',
    tags: ['闭包', '原型链', 'Promise', 'ES6+'],
    count: 8,
  },
  {
    key: 'css',
    path: '/css',
    icon: <BgColorsOutlined />,
    title: 'CSS',
    description: '盒模型、布局、动画、响应式设计等',
    color: '#264de4',
    textColor: '#fff',
    tags: ['Flexbox', 'Grid', 'BFC', '动画'],
    count: 6,
  },
  {
    key: 'react',
    path: '/react',
    icon: <ThunderboltOutlined />,
    title: 'React',
    description: 'Hooks、虚拟DOM、组件优化、状态管理',
    color: '#61dafb',
    textColor: '#20232a',
    tags: ['Hooks', '虚拟DOM', 'Context', 'Fiber'],
    count: 7,
  },
  {
    key: 'browser',
    path: '/browser',
    icon: <GlobalOutlined />,
    title: '浏览器原理',
    description: '渲染流程、事件循环、存储机制、安全',
    color: '#4285f4',
    textColor: '#fff',
    tags: ['渲染', '事件循环', '缓存', '安全'],
    count: 5,
  },
  {
    key: 'network',
    path: '/network',
    icon: <CloudOutlined />,
    title: '网络协议',
    description: 'HTTP/HTTPS、TCP/IP、WebSocket、跨域',
    color: '#00b894',
    textColor: '#fff',
    tags: ['HTTP', 'HTTPS', 'TCP', 'WebSocket'],
    count: 5,
  },
  {
    key: 'performance',
    path: '/performance',
    icon: <RocketOutlined />,
    title: '性能优化',
    description: '加载优化、运行时优化、打包优化策略',
    color: '#e17055',
    textColor: '#fff',
    tags: ['懒加载', '缓存', 'Tree Shaking', 'CDN'],
    count: 6,
  },
];

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <Title level={1} className={styles.heroTitle}>
            📚 前端开发知识点笔记
          </Title>
          <Paragraph className={styles.heroDesc}>
            借助 <strong>Demo 演示</strong> 和 <strong>文案介绍</strong>，系统梳理前端开发相关的知识点。
            <br />
            涵盖 JavaScript、CSS、React、浏览器原理、网络协议、性能优化等核心领域。
          </Paragraph>
          <div className={styles.stats}>
            <Statistic
              title="知识专题"
              value={6}
              prefix={<ReadOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
            <Statistic
              title="知识点总数"
              value={37}
              prefix={<BulbOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </div>
        </div>
      </div>

      {/* Topic Cards */}
      <Row gutter={[20, 20]} className={styles.topics}>
        {topics.map((topic) => (
          <Col key={topic.key} xs={24} sm={12} lg={8}>
            <Link to={topic.path}>
              <Card
                className={styles.topicCard}
                variant="borderless"
                style={{
                  background: `linear-gradient(135deg, ${topic.color}dd, ${topic.color}99)`,
                }}
              >
                <div className={styles.topicIcon} style={{ color: topic.textColor }}>
                  {topic.icon}
                </div>
                <Title level={3} style={{ color: topic.textColor, margin: '12px 0 8px' }}>
                  {topic.title}
                </Title>
                <Paragraph
                  style={{ color: topic.textColor, opacity: 0.85, margin: '0 0 12px' }}
                >
                  {topic.description}
                </Paragraph>
                <div className={styles.topicTags}>
                  {topic.tags.map((tag) => (
                    <Tag
                      key={tag}
                      style={{
                        background: 'rgba(255,255,255,0.25)',
                        border: 'none',
                        color: topic.textColor,
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
                <div className={styles.topicCount} style={{ color: topic.textColor }}>
                  {topic.count} 个知识点 →
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
