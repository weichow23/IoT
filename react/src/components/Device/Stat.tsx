/* eslint-disable */
import {Card} from 'antd';
import styles from './Device.module.scss'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, Table, Tag, Pagination } from 'antd';

<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak='Ur6D7GxIvSY4eegG2qw9Ukr2UhNneZxt'"></script>
import { useUser } from '@/components/User/UserState';

import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const Stat: React.FC = () => {
  const [deviceList, setDeviceList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [selectCode, setSelectCode] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    showTotal: (total: number, range: [number, number]) => {
      return `第 ${range[0]}-${range[1]} 条，共 ${total} 条`;
    },
    showQuickJumper: true,
    showSizeChanger: false,
    total: 0  //您可能需要从服务器获取总条数，并在数据更新时保持此状态的更新
  });
  const [polylinePath, setPolylinePath] = useState([]);
  const { state } = useUser(); //全局变量 email和token
  const columns = [
    {
      title: "警告",
      dataIndex: "alert",
      width: "10%",
      render: (alert: boolean) => (
        <Tag color={alert ? "red" : "blue"}>{alert ? "警告" : "正常"}</Tag>
      )
    },
    {
      title: "信息",
      dataIndex: "info",
      width: "30%",
    },
    {
      title: "经度",
      dataIndex: "lat",
      width: "15%",
    },
    {
      title: "纬度",
      dataIndex: "lng",
      width: "15%",
    },
    {
      title: "时间",
      dataIndex: "timestamp",
      width: "20%",
    },
    {
      title: "数值",
      dataIndex: "value",
      width: "10%",
    },
  ];

  useEffect(() => {
    getDevice();
  }, []);

  useEffect(() => {
    const timer = setInterval(getMessage, 3000);
    return () => clearInterval(timer);
  }, [selectCode]);

  const getDevice = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getDevice", { params: { token: state.token }});
      if (res.data.code === 0) {
        setDeviceList(res.data.data);
      } else {
        console.log("获取设备失败");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMessage = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getMessage", { params: { clientId: selectCode } });
      if (res.data.code === 0) {
        setMessageList(res.data.data);
        const data = res.data.data.map((item: any) => ({ lat: item.lat, lng: item.lng }));
        setPolylinePath(data);
      } else {
        console.log("获取消息失败");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectCode(value);
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  return (
    <div>
      <div style={{position: 'relative', marginBottom: 20, textAlign: 'center', display: deviceList.length ? 'block' : 'none'}}>
        请选择设备：
        <Select
          placeholder="请选择设备"
          style={{width: 400, marginRight: 20}}
          onChange={handleSelectChange}
        >
          {deviceList.map((item: any) => (
            <Select.Option key={item.id} value={item.code}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
        <Button type="dashed" onClick={getMessage}>确定</Button>
      </div>
      <Table
        columns={columns}
        dataSource={messageList}
        pagination={pagination}
        onChange={handleTableChange}
      />
      <MapContainer center={[22.187404991398786, 113.81835937500001]} zoom={10} style={{height: "400px", width: "100%"}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polyline positions={polylinePath} pathOptions={{color: 'blue'}} />
      </MapContainer>
    </div>
  )
};