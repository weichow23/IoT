/* eslint-disable */
import React from 'react';
import styles from './Main.module.scss'
import { Space, Typography } from 'antd';
import { Card } from 'antd';
const { Text, Link } = Typography;

export const QA = ({ }) => {
  const pdfFileUrl = '../../assets/manual.pdf';

  return (
    <div className={styles['layoutQA']}>
      <Space direction="vertical" size={16}>
        <Card title="操作问题" bordered={true} hoverable={true} style={{ width: '100%', margin: '0 auto' }}>
          <>
            详见用户手册
            <br />
          </>
        </Card>

        <Card title="运行问题" bordered={true} hoverable={true} style={{ width: '100%', margin: '0 auto' }}>
          <>
            详见运行开发指南手册
            <br />
          </>
        </Card>
        <Card title="内核问题" bordered={true} hoverable={true} style={{ width: '100%', margin: '0 auto' }}>
          <>
            详见接口文档
            <br />
          </>
        </Card>

        <Card title="手机端展示" bordered={true} hoverable={true} style={{ width: '100%', margin: '0 auto' }}>
          <>
            <iframe src={pdfFileUrl} style={{ width: '100%', height: '500px' }}></iframe>
            <br />
          </>
        </Card>
      </Space>
    </div>
  )
}
