import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'umi';
import {
  Layout,
  Menu,
  Typography,
  Tag,
} from 'antd';
import {
  HomeOutlined,
  CodeOutlined,
  BgColorsOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  CloudOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import styles from './index.less';

const { Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link to="/">首页</Link>,
  },
  {
    key: '/javascript',
    icon: <CodeOutlined />,
    label: <Link to="/javascript">JavaScript</Link>,
  },
  {
    key: '/css',
    icon: <BgColorsOutlined />,
    label: <Link to="/css">CSS</Link>,
  },
  {
    key: '/react',
    icon: <ThunderboltOutlined />,
    label: <Link to="/react">React</Link>,
  },
  {
    key: '/browser',
    icon: <GlobalOutlined />,
    label: <Link to="/browser">浏览器原理</Link>,
  },
  {
    key: '/network',
    icon: <CloudOutlined />,
    label: <Link to="/network">网络协议</Link>,
  },
  {
    key: '/performance',
    icon: <RocketOutlined />,
    label: <Link to="/performance">性能优化</Link>,
  },
];

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className={styles.layout}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={styles.sider}
        width={220}
        theme="light"
      >
        <div className={styles.logo}>
          {!collapsed && (
            <Title level={5} style={{ margin: 0, color: '#1677ff' }}>
              📚 前端知识点
            </Title>
          )}
          {collapsed && <span style={{ fontSize: 20 }}>📚</span>}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}
