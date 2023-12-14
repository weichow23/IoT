/* eslint-disable */
import {Card} from 'antd';
import styles from './Device.module.scss'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, Button, Table, Tag, Pagination } from 'antd';

<script type="text/javascript" src="http://api.map.baidu.com/api?v=3.0&ak='Ur6D7GxIvSY4eegG2qw9Ukr2UhNneZxt'"></script>
import { useUser } from '@/components/User/UserState';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L, {Browser} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { renderToString } from 'react-dom/server'
import safari = Browser.safari;

export const Stat: React.FC = () => {
  const [deviceList, setDeviceList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [selectClientId, setSelectClientId] = useState("");
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
  }, [selectClientId]);

  const getDevice = async () => {
    try {
      const res = await axios.get("http://localhost:3790/getDevice", { params: { token: state.token }});
      if (res.data.verify === 0) {
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
      const res = await axios.get("http://localhost:3790/getMessage", { params: { clientId: selectClientId, token: state.token } });
      if (res.data.verify === 0) {
        setMessageList(res.data.data);
        // const data = res.data.data.map((item: any) => ({ lat: item.lat, lng: item.lng }));
        // setPolylinePath(data);
        const data = res.data.data.map((item: any) => ({
          lat: item.lat,
          lng: item.lng,
          alert: item.alert,
          timestamp: item.timestamp
        }));
        setPolylinePath(data);
      } else {
        console.log("获取消息失败");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectChange = (value: string) => {
    setSelectClientId(value);
  };

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };
  const createCustomIcon = (alert: boolean) => {
    const iconHtml = renderToString(
      <FontAwesomeIcon icon={faLocationDot} style={{ color: alert ? 'IndianRed' : 'CornflowerBlue' }} />
    );

    return L.divIcon({
      html: iconHtml,
      iconSize: [25, 25],
      className: ''
    });
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
            <Select.Option key={item.id} value={item.clientId}>
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
      <MapContainer center={[30.3, 120.4]} zoom={10.4} style={{height: "400px", width: "100%"}}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='...省略...'
        />
        {polylinePath.map((point, index) => (
          <Marker
            key={index}
            position={[point.lat, point.lng]}
            icon={createCustomIcon(point.alert)}
            >
            <Popup>{`经度: ${point.lat}, 纬度: ${point.lng} , 时间: ${formatTimestamp(point.timestamp)}`}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
};

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTimestamp = `${month}月${day}日${hours}:${minutes}`;
  return formattedTimestamp;
}