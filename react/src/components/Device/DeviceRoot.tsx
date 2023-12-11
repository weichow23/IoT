/* eslint-disable */
import React from 'react';
import {Card, Image} from 'antd';
import styles from './Device.module.scss'
import { Overall } from '@/components/Device/Overall'
import { Stat } from '@/components/Device/Stat'
import { Instance } from '@/components/Device/Instance'
import IcLogo from '../../assets/root.png'
export const DeviceRoot = ({ }) => {
  return (
    <div className={styles.layout}>
    <Card bordered={true} hoverable={true} style={{ width: '90%', marginBottom: '16px', textAlign: 'center' }}>
      <div style={{ display: 'inline-block' }}>
        <Image
          width={120}
          src={IcLogo}
          preview={false}
          style={{ marginRight: '8px' }}
        />
        <h1 style={{ display: 'inline-block', verticalAlign: 'middle', paddingLeft: '18px' }}>管理员模式</h1>
      </div>
    </Card>
    <Card title="设备总览" bordered={true} hoverable={true} style={{ width: '90%', marginBottom: '16px'}}>
      <Overall/>
    </Card>
    {/*<Card title="数据统计" bordered={true} hoverable={true} style={{ width: '90%', marginBottom: '16px'}}>*/}
    {/*  <Stat/>*/}
    {/*</Card>*/}
    <Card title="设备中心" bordered={true} hoverable={true} style={{ width: '90%' }}>
      <Instance/>
    </Card>
    </div>
  )
}


