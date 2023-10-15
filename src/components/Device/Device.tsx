/* eslint-disable */
import React from 'react';
import {Card} from 'antd';
import styles from './Device.module.scss'
import { Overall } from '@/components/Device/Overall'
import { Stat } from '@/components/Device/Stat'
import { Instance } from '@/components/Device/Instance'

export const Device = ({ }) => {
  return (
    <div className={styles.layout}>
    <Card title="设备总览" bordered={true} hoverable={true} style={{ width: '90%', marginBottom: '16px'}}>
      <Overall/>
    </Card>
    <Card title="数据统计" bordered={true} hoverable={true} style={{ width: '90%', marginBottom: '16px'}}>
      <Stat/>
    </Card>
    <Card title="设备中心" bordered={true} hoverable={true} style={{ width: '90%' }}>
      <Instance/>
    </Card>
    </div>
  )
}


