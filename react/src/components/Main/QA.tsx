/* eslint-disable */
import React from 'react';
import styles from './Main.module.scss'
import { Space, Typography } from 'antd';
import { Card } from 'antd';
const { Text, Link } = Typography;

export const QA = ({ }) => {
  const pdfFileUrl = '../../assets/manual.pdf';
  const manualpdfFile = '/manual.pdf';  // 使用相对路径指向 public 目录中的文件 放在其他目录可能打不开
  const userpdfFile = '/user.pdf';
  const interfacepdfFile = '/interface.pdf';
  return (
    <div className={styles['layoutQA']}>
      <Space direction="vertical" size={16}>
        <Card title="操作问题" bordered={true} hoverable={true} style={{ width: '160%', margin: '0 auto', left: '-30%'}}>
          <>
            详见<Link href={userpdfFile} target="_blank">用户手册</Link>(点击链接可以打开)
            <br />
          </>
        </Card>

        <Card title="运行问题" bordered={true} hoverable={true} style={{ width: '160%', margin: '0 auto', left: '-30%' }}>
          <>
            详见<Link href={manualpdfFile} target="_blank">运行开发指南手册</Link>(点击链接可以打开)
            <br />
          </>
        </Card>
        <Card title="内核问题" bordered={true} hoverable={true} style={{ width: '160%', margin: '0 auto', left: '-30%' }}>
          <>
            详见<Link href={interfacepdfFile} target="_blank">接口文档</Link>(点击链接可以打开)
            <br />
          </>
        </Card>

        <Card title="手机端展示" bordered={true} hoverable={true} style={{ width: '160%', margin: '0 auto', left: '-30%'}}>
          <>
            <iframe src={pdfFileUrl} style={{ width: '100%', height: '500px' }}></iframe>
            <br />
          </>
        </Card>
      </Space>
    </div>
  )
}
