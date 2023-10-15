/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react'
import * as echarts from 'echarts'
import axios from 'axios'
import { Card, Row, Col } from 'antd'
import { useUser } from '@/components/User/UserState';

export const Overall: React.FC = () => {
  const [onlineDevice, setOnlineDevice] = useState(0)
  const [offlineDevice, setOfflineDevice] = useState(0)
  const [recentDay, setRecentDay] = useState<string[]>([])
  const [barData, setBarData] = useState<number[]>([])
  const [total, setTotal] = useState<number[]>([])
  const [normal, setNormal] = useState<number[]>([])
  const [alert, setAlert] = useState<number[]>([])

  const pieChartRef = useRef<HTMLDivElement>(null)
  const barChartRef = useRef<HTMLDivElement>(null)
  const lineChartRef = useRef<HTMLDivElement>(null)
  const { state } = useUser()

  useEffect(() => {
    // 数据获取
    getDevice();
    getRecentDevice();
    getRecentMessage();
  }, []); // 空依赖数组保证此函数只在组件挂载时运行一次

  useEffect(() => {
    // 初始化和绘制图表
    const myPieChart = echarts.init(pieChartRef.current!);
    const myBarChart = echarts.init(barChartRef.current!);
    const myLineChart = echarts.init(lineChartRef.current!);

    drawPie(myPieChart);
    drawBar(myBarChart);
    drawLine(myLineChart);

    return () => {
      myPieChart.dispose();
      myBarChart.dispose();
      myLineChart.dispose();
    };
  }, [onlineDevice, offlineDevice, recentDay, barData, total, normal, alert]); // 这里依赖于可能变动的状态变量

  const drawPie = (chart: echarts.ECharts) => {
    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: "设备在线情况",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "40",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: onlineDevice, name: '在线设备' },
            { value: offlineDevice, name: '离线设备' }
          ],
        },
      ],
    };
    chart.setOption(option);
  }

  const drawBar = (chart: echarts.ECharts) => {
    const option = {
      xAxis: {
        type: 'category',
        data: recentDay,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: barData,
          type: 'bar',
        },
      ],
    };
    chart.setOption(option);
  }


  const drawLine = (chart: echarts.ECharts) => {
    const option = {
      title: {
        text: "",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["总消息", "报警消息", "正常消息"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: recentDay,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: '总消息',
          type: 'line',
          stack: '总量',
          data: total,
        },
        {
          name: '报警消息',
          type: 'line',
          stack: '总量',
          data: alert,
        },
        {
          name: '正常消息',
          type: 'line',
          stack: '总量',
          data: normal,
        },
      ],
    };
    chart.setOption(option);
  }

  const getDevice = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getDevice', {
        params: {
          token: state.token,
        },
      })
      // console.log('Querying Token:', response.data.data);
      if (!response.data || typeof response.data.code === 'undefined') {
        console.error('Unexpected response format:', response.data)
        return
      }
      if (response.data.code === 0) {
        const deviceList = response.data.data
        if (!Array.isArray(deviceList)) {
          console.error('Unexpected deviceList format:', deviceList)
          return
        }
        let online = 0
        let offline = 0
        deviceList.forEach((device: any) => {
          if (!device || typeof device.code !== 'string') {
            console.error('Unexpected device format:', device)
            return
          }
          if (device.code > 'device0000' && device.code < 'device0006') {
            online += 1
          } else {
            offline += 1
          }
        })
        setOnlineDevice(online)
        setOfflineDevice(offline)
      } else {
        console.error('Error fetching devices code:', response.data.code, 'message:', (response.data.message || 'No error message provided'))
      }
    } catch (error) {
      console.error('Error fetching devices:', error.toString())
      if (error.response) {
        console.error('Server response:', error.response.data)
        console.error('Status code:', error.response.status)
        console.error('Headers:', error.response.headers)
      } else if (error.request) {
        console.error('No response received:', error.request)
      } else {
        console.error('Error message:', error.message)
      }
    }
  }

  const getRecentDevice = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getRecentDevice', {
        params: {
          token: state.token,
        },
      })
      if (!response.data || typeof response.data.code === 'undefined') {
        console.error('Unexpected response format:', response.data)
        return
      }
      if (response.data.code === 0) {
        console.log(response.data.day)
        setRecentDay(response.data.day)
        setBarData(response.data.count)
      } else {
        console.error('Error fetching recent devices, code:', response.data.code, 'message:', response.data.message || 'No error message provided')
      }
    } catch (error) {
      console.error('Error fetching recent devices:', error.toString())
      if (error.response) {
        console.error('Server response:', error.response.data)
      }
    }
  }

  const getRecentMessage = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getRecentMessage', {
        params: {
          token: state.token,
        },
      })
      if (!response.data || typeof response.data.code === 'undefined') {
        console.error('Unexpected response format:', response.data)
        return
      }
      if (response.data.code === 0) {
        setTotal(response.data.total)
        setNormal(response.data.normal)
        setAlert(response.data.alert)
      } else {
        console.error('Error fetching recent messages, code:', response.data.code, 'message:', response.data.message || 'No error message provided')
      }
    } catch (error) {
      console.error('Error fetching recent messages:', error.toString())
      if (error.response) {
        console.error('Server response:', error.response.data)
      }
    }
  }


  return (
    <div style={{ padding: '5px' }}>
      <Row gutter={16}>
        <Col span={12}>
          <Card hoverable style={{ marginTop: '5px', marginBottom: '5px' }}>
            <div
              ref={pieChartRef}
              style={{ width: '100%', height: '400px', marginTop: '10px' }}
            ></div>
            <div style={{ textAlign: 'center', paddingTop: '5px' }}>
              设备在线情况
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card hoverable style={{ marginTop: '5px', marginBottom: '5px' }}>
            <div
              ref={barChartRef}
              style={{ width: '100%', height: '400px', marginTop: '10px' }}
            ></div>
            <div style={{ textAlign: 'center', paddingTop: '5px' }}>
              最近七天设备新增情况
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Card hoverable style={{ marginTop: '5px', marginBottom: '5px' }}>
            <div
              ref={lineChartRef}
              style={{ width: '100%', height: '400px', marginTop: '10px' }}
            ></div>
            <div style={{ textAlign: 'center', paddingTop: '5px' }}>
              最近七天接受消息情况
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
