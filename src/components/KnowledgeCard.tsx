import React from 'react';
import { Card, Typography, Tag, Divider, Row, Col } from 'antd';
import styles from './KnowledgeCard.less';

const { Title, Paragraph, Text } = Typography;

interface KnowledgePoint {
  title: string;
  tags?: string[];
  description: string | React.ReactNode;
  demo?: React.ReactNode;
  code?: string;
  codeCompare?: string; // 对照代码，与 code 并排展示
  codeLabel?: string; // 左侧代码标签（有 codeCompare 时显示）
  codeCompareLabel?: string; // 右侧对照代码标签
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
      {(item.code || item.codeCompare) && (
        <div className={styles.codeSection}>
          <Text type="secondary" className={styles.demoLabel}>
            💻 示例代码
          </Text>
          {item.codeCompare ? (
            <Row gutter={24}>
              <Col xs={24} md={12}>
                {item.codeLabel && (
                  <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>{item.codeLabel}</Text>
                )}
                <pre className={styles.codeBlock}>{item.code}</pre>
              </Col>
              <Col xs={24} md={12}>
                {item.codeCompareLabel && (
                  <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>{item.codeCompareLabel}</Text>
                )}
                <pre className={styles.codeBlock}>{item.codeCompare}</pre>
              </Col>
            </Row>
          ) : (
            <pre className={styles.codeBlock}>{item.code}</pre>
          )}
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
