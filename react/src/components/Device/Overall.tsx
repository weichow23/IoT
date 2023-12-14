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
    drawCalendar(myBarChart);
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
      formatter: '{a} <br/>{b} : {c} ({d}%)' // 格式化鼠标悬停时显示的提示信息
    },
    legend: {
      top: "5%",
      left: "center",
      data: ['在线设备', '离线设备'] // 定义图例的数据
    },
    series: [
      {
        name: "设备在线情况",
        type: "pie",
        radius: [20, 140], // 南丁格尔图的内半径和外半径
        center: ['50%', '50%'], // 图表的中心位置
        roseType: 'radius', // 南丁格尔图的类型，这里使用'radius'
        itemStyle: {
          borderRadius: 5, // 设置扇形的边角圆滑度
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "20",
            fontWeight: "bold",
          },
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

  const getVirtualData = (year: number, month: number) => {
      const data: [string, number][] = [];
      recentDay.forEach((dateStr, index) => {
        const date = new Date(dateStr);
        console.log(date);
        console.log('Checking year and month:', date.getFullYear(), date.getMonth() + 1, year, month);

        // if (date.getFullYear() === year && date.getMonth() + 1 === month) {
        if (date.getMonth() + 1 === month) {
          console.log('Inside the IF condition');
          // const formattedDate = echarts.time.format(date, '{yyyy}-{MM}-{dd}', false);
          const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          data.push([formattedDate, barData[index]]);
        }

      });
      console.log(data);
      return data;
  }

  const drawCalendar = (chart: echarts.ECharts) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const calendarData = getVirtualData(currentYear, currentMonth);

    const recentDeviceDate = new Date(recentDay[recentDay.length - 1]);
    if(recentDeviceDate.getFullYear() === currentYear && recentDeviceDate.getMonth() + 1 === currentMonth) {
      const index = calendarData.findIndex(data => data[0] === echarts.time.format(recentDeviceDate, '{yyyy}-{MM}-{dd}', false));
      if(index !== -1) {
        calendarData[index][1] = barData[barData.length - 1];
      }
    }

    const option = {
      tooltip: {
        position: 'top'
      },
      visualMap: [
        {
          min: 0,
          max: 4,
          inRange: {
            color: ['grey', 'blue'],  // color range
            opacity: [0, 0.3]
          },
          controller: {
            inRange: {
              opacity: [0.3, 0.6]
            },
            outOfRange: {
              color: '#ccc'
            }
          },
          seriesIndex: [0],
          orient: 'horizontal',
          left: 'center',
          bottom: 20
        }
      ],
      calendar: [
        {
          orient: 'vertical',
          left: 'center',  // This makes sure that the calendar is centered
          top: 'middle',  // This vertically centers the calendar
          yearLabel: {
            margin: 40
          },
          monthLabel: {
            nameMap: 'cn',
            margin: 20
          },
          dayLabel: {
            firstDay: 1,
            nameMap: 'cn'
          },
          cellSize: 40,
          range: `${currentYear}-${currentMonth}`
        }
      ],
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: calendarData
        }
      ]
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
      const response = await axios.get('http://localhost:3790/getDevice', {
        params: {
          token: state.token,
        },
      })
      // console.log('Querying Token:', response.data.data);
      if (!response.data || typeof response.data.verify === 'undefined') {
        console.error('Unexpected response format:', response.data)
        return
      }
      if (response.data.verify === 0) {
        const deviceList = response.data.data
        if (!Array.isArray(deviceList)) {
          console.error('Unexpected deviceList format:', deviceList)
          return
        }
        let online = 0
        let offline = 0
        deviceList.forEach((device: any) => {
          if (!device || typeof device.clientId !== 'string') {
            console.error('Unexpected device format:', device)
            return
          }
          if (device.clientId > 'device0000' && device.clientId < 'device0006') {
            online += 1
          } else {
            offline += 1
          }
        })
        setOnlineDevice(online)
        setOfflineDevice(offline)
      } else {
        console.error('Error fetching devices clientId:', response.data.verify, 'message:', (response.data.message || 'No error message provided'))
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
      const response = await axios.get('http://localhost:3790/getRecentDevice', {
        params: {
          token: state.token,
        },
      })
      if (!response.data || typeof response.data.verify === 'undefined') {
        console.error('Unexpected response format:', response.data)
        return
      }
      if (response.data.verify === 0) {
        console.log(response.data.day)
        setRecentDay(response.data.day)
        setBarData(response.data.count)
      } else {
        console.error('Error fetching recent devices:', response.data.verify, 'message:', response.data.message || 'No error message provided')
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
      const response = await axios.get('http://localhost:3790/getRecentMessage', {
        params: {
          token: state.token,
        },
      })
      if (!response.data || typeof response.data.verify === 'undefined') {
        console.error('Unexpected response format:', response.data)
        return
      }
      if (response.data.verify === 0) {
        setTotal(response.data.total)
        setNormal(response.data.normal)
        setAlert(response.data.alert)
      } else {
        console.error('Error fetching recent messages:', response.data.verify, 'message:', response.data.message || 'No error message provided')
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
              本月设备新增情况
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
              近一个月内接受消息情况
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
