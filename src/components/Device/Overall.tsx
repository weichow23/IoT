/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { Card, Row, Col } from "antd";
import * as echarts from "echarts";
import axios from "axios";
import styles from "./Total.module.scss"; // 这个样式文件你需要根据实际情况创建和调整

interface DeviceData {
  onlineDevice: number;
  offlineDevice: number;
}

interface RecentDeviceData {
  recentDay: string[];
  barData: number[];
}

interface MessageData {
  total: number[];
  normal: number[];
  alert: number[];
}

export const Overall: React.FC = () => {
  const pieChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);

  const [deviceData, setDeviceData] = useState<DeviceData>({
    onlineDevice: 0,
    offlineDevice: 0,
  });

  const [recentDeviceData, setRecentDeviceData] = useState<RecentDeviceData>({
    recentDay: [],
    barData: [],
  });

  const [messageData, setMessageData] = useState<MessageData>({
    total: [],
    normal: [],
    alert: [],
  });

  useEffect(() => {
    // Assume token is stored in local storage or somewhere. Update as per your setup.
    const token = localStorage.getItem("userToken") || "";

    const getPieChart = echarts.init(pieChartRef.current!);
    const getBarChart = echarts.init(barChartRef.current!);
    const getLineChart = echarts.init(lineChartRef.current!);

    axios
      .get("/api/getDevice", { params: { token } })
      .then((res) => {
        if (res.data.code === 0) {
          // Process and set data as per response
          setDeviceData({
            onlineDevice: res.data.onlineDevice,
            offlineDevice: res.data.offlineDevice,
          });
          // Draw pie chart here or in another useEffect
        }
      });

    axios
      .get("/api/getRecentDevice", { params: { token } })
      .then((res) => {
        if (res.data.code === 0) {
          setRecentDeviceData({
            recentDay: res.data.day,
            barData: res.data.count,
          });
          // Draw bar chart here or in another useEffect
        }
      });

    axios
      .get("/api/getRecentMessage", { params: { token } })
      .then((res) => {
        if (res.data.code === 0) {
          setMessageData({
            total: res.data.total,
            normal: res.data.normal,
            alert: res.data.alert,
          });
          // Draw line chart here or in another useEffect
        }
      });

    // Cleanup charts on component unmount
    return () => {
      getPieChart.dispose();
      getBarChart.dispose();
      getLineChart.dispose();
    };
  }, []);

  useEffect(() => {
    // Example of drawing pie chart. You need to adapt based on actual logic and data format.
    const getPieChart = echarts.init(pieChartRef.current!);
    const option = {
      // Your chart options here
    };
    getPieChart.setOption(option);
  }, [deviceData]);

  return (
    <div>
      <div style={{ padding: "5px" }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card hoverable style={{ marginTop: "5px", marginBottom: "5px" }}>
              <div
                ref={pieChartRef}
                style={{ width: "100%", height: "400px", marginTop: "10px" }}
              ></div>
              {/*<Card.Meta title="" style={{ textAlign: "center", paddingTop: "5px" }}>*/}
              {/*  设备在线情况*/}
              {/*</Card.Meta>*/}
            </Card>
          </Col>
          <Col span={12}>
            <Card hoverable style={{ marginTop: "5px", marginBottom: "5px" }}>
              <div
                ref={barChartRef}
                style={{ width: "100%", height: "400px", marginTop: "10px" }}
              ></div>
              {/*<Card.Meta title="" style={{ textAlign: "center", paddingTop: "5px" }}>*/}
              {/*  最近七天设备新增情况*/}
              {/*</Card.Meta>*/}
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Card hoverable style={{ marginTop: "5px", marginBottom: "5px" }}>
              <div
                ref={lineChartRef}
                style={{ width: "100%", height: "400px", marginTop: "10px" }}
              ></div>
              {/*<Card.Meta title="" style={{ textAlign: "center", paddingTop: "5px" }}>*/}
              {/*  最近七天接受消息情况*/}
              {/*</Card.Meta>*/}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
