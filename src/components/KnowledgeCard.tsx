import React from 'react';
import { Card, Typography, Tag, Divider } from 'antd';
import styles from './KnowledgeCard.less';

const { Title, Paragraph, Text } = Typography;

interface KnowledgePoint {
  title: string;
  tags?: string[];
  description: string | React.ReactNode;
  demo?: React.ReactNode;
  code?: string;
}

interface KnowledgeCardProps {
  item: KnowledgePoint;
}

export function KnowledgeCard({ item }: KnowledgeCardProps) {
  return (
    <Card className={styles.card} variant="borderless">
      <div className={styles.cardHeader}>
        <Title level={4} style={{ margin: 0 }}>
          {item.title}
        </Title>
        <div className={styles.tags}>
          {item.tags?.map((tag) => (
            <Tag key={tag} color="blue">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
      <Divider style={{ margin: '12px 0' }} />
      <Paragraph className={styles.description}>{item.description}</Paragraph>
      {item.demo && (
        <div className={styles.demoSection}>
          <Text type="secondary" className={styles.demoLabel}>
            🎮 在线演示
          </Text>
          <div className={styles.demoContent}>{item.demo}</div>
        </div>
      )}
      {item.code && (
        <div className={styles.codeSection}>
          <Text type="secondary" className={styles.demoLabel}>
            💻 示例代码
          </Text>
          <pre className={styles.codeBlock}>{item.code}</pre>
        </div>
      )}
    </Card>
  );
}

interface PageHeaderProps {
  icon: string;
  title: string;
  description: string;
  color?: string;
}

export function PageHeader({ icon, title, description, color = '#1677ff' }: PageHeaderProps) {
  return (
    <Card
      className={styles.pageHeader}
      style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, borderColor: `${color}30` }}
    >
      <div className={styles.pageHeaderContent}>
        <span className={styles.pageHeaderIcon}>{icon}</span>
        <div>
          <Title level={2} style={{ margin: 0, color }}>
            {title}
          </Title>
          <Paragraph style={{ margin: '8px 0 0', color: '#595959', fontSize: 15 }}>
            {description}
          </Paragraph>
        </div>
      </div>
    </Card>
  );
}
