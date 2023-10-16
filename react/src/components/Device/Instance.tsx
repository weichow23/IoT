/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Table, Divider, message, Tooltip } from 'antd';
import styles from './Device.module.scss';
import axios from 'axios';
import { useUser } from '@/components/User/UserState';
export const Instance = () => {
  // States
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [visibleAlter, setVisibleAlter] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [alterData, setAlterData] = useState({
    id: 0,
    name: '',
    code: '',
    description: '',
    time: '',
    oldName: '',
  });
  const { state } = useUser()
  const { dispatch } = useUser();
  // Methods
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
        setDeviceList(deviceList);
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
  const showCreateModal = () => setVisibleCreate(true);
  const showAlterModal = (record) => {
    setAlterData({
      id: record.id,
      name: record.name,
      code: record.code,
      description: record.description,
      time: record.create_time,
      oldName: record.name,
    });
    setVisibleAlter(true);
  };
  const handleCreateSubmit = async (values) => {
    try {
      // ... 发送 POST 请求到服务器来创建一个新的设备
      const response = await axios.post('http://localhost:5000/createDevice', {
        token: state.token,
        name: values.name,
        code: values.code,
        description: values.description,
        user: state.username,
      });
      // 检查响应并处理它
      if(response.data.code === 0) {
        message.success('设备添加成功！');
        getDevice();
        setVisibleCreate(false);
      } else {
        message.error('设备添加失败: ' + response.data.msg);
      }
    } catch (err) {
      console.error(err);
      message.error('添加设备失败，请检查网络连接。');
    }
  };
  const handleAlterSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/alterDevice', {
        id: alterData.id,
        token: state.token,
        code: alterData.code,
        newName: alterData.name,
        oldName: alterData.oldName,
        description: alterData.description,
      });
      alert(response.data.msg);
      getDevice();  // 重新获取设备列表
    } catch (err) {
      console.error(err);
    }
  };
  const deleteDevice = async (deviceName: string) => {
    Modal.confirm({
      title: '您确定删除该设备吗',
      content: '删除了不可恢复哦~',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await axios.get('http://localhost:5000/deleteDevice', {
            params: {
              token: state.token,
              name: deviceName,
            }
          });

          message.success(response.data.msg);
          alert(response.data.msg);
          getDevice();  // 重新获取设备列表
        } catch (err) {
          console.error(err);
          message.error('删除设备失败');
        }
      },
      onCancel() {
        console.log('取消删除');
      },
    });
  };
  // Fetch data on component mount
  useEffect(() => {
    getDevice();
  }, []);

useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getUser', {
                params: {
                    token: state.token,
                }
            });
            if (response.data.code === 0) {
                console.log('nickname:', response.data.data);
                dispatch({ type: 'setUsername', payload: response.data.data });
            } else {
                message.error("获取用户信息失败，请重新登录！");
            }
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };
    fetchUserData();
  }, [state.token]);

  // Table configuration
  const columns = [
      {
        title: "序号",
        dataIndex: "id",
        width: "7%",
      },
      {
        title: "设备名",
        dataIndex: "name",
        width: "15%",
      },
      {
        title: "数据流",
        dataIndex: "code",
        width: "15%",
        render: (text) => (
          <Tooltip title="仅有...">
            <a>{text}</a>
          </Tooltip>
        ),
      },
      {
        title: "描述",
        dataIndex: "description",
        width: "20%",
      },
      {
        title: "创建日期",
        dataIndex: "create_time",
        width: "20%",
      },
    {
      title: '选项',
      dataIndex: 'option',
      render: (text, record) => (
        <>
          <a onClick={() => deleteDevice(record.name)}>删 除 </a>
          <Divider type="vertical" />
          <a onClick={() => showAlterModal(record)}>更 改</a>
        </>
      ),
    },
  ];

  return (
    <div className={styles.layout}>
      <Modal
        visible={visibleCreate}
        title="新建设备"
        footer={null}
        onCancel={() => setVisibleCreate(false)}
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onFinish={handleCreateSubmit}>
          <Form.Item label="设备名称" name="name" rules={[{ required: true, message: '请输入设备名称!' }]}>
            <Input value={alterData.name} onChange={(e) => setAlterData({...alterData, name: e.target.value})} />
          </Form.Item>
          <Form.Item label="数据流" name="code" rules={[{ required: true, message: '请输入数据流!' }]}>
            <Input value={alterData.code} onChange={(e) => setAlterData({...alterData, code: e.target.value})} />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input value={alterData.description} onChange={(e) => setAlterData({...alterData, description: e.target.value})} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={visibleAlter}
        title="更改设备信息"
        footer={null}
        onCancel={() => setVisibleAlter(false)}
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onFinish={handleAlterSubmit}>
            <Form.Item label="设备名称" name="name" initialValue={alterData.name} rules={[{ required: true, message: '请输入设备名称!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="数据流" name="code" initialValue={alterData.code} rules={[{ required: true, message: '请输入数据流!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="描述" name="description" initialValue={alterData.description}>
                <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                <Button type="primary" htmlType="submit">
                    确认
                </Button>
            </Form.Item>
        </Form>
      </Modal>

      <Table columns={columns} dataSource={deviceList} className={styles.tableNoMargin}/>
      <Button size="large"
              type="primary"
              onClick={showCreateModal}
              className={styles['login-button']}
              style={{ width: '120px'}}>
        添加设备
      </Button>
    </div>
  );
};
