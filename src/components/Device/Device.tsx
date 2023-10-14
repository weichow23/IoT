/* eslint-disable */
import React from 'react';
import {Card} from 'antd';
import styles from './Device.module.scss'
import { Overall } from '@/components/Device/Overall'
export const Device = ({ }) => {
  return (
    <div className={styles.layout}>
    <Card title="设备总览" bordered={true} hoverable={true} style={{ width: '90%', marginBottom: '16px'}}>
      this is a device page
    </Card>
    <Card title="数据统计" bordered={true} hoverable={true} style={{ width: '90%', marginBottom: '16px'}}>
      this is a device page
      {/*<Overall/>存在404错误，应该是因为资源访问失败*/}
    </Card>
    <Card title="设备中心" bordered={true} hoverable={true} style={{ width: '90%' }}>
      this is a device page
    </Card>
    </div>
  )
}


