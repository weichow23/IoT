/* eslint-disable */
import React, { useState, useEffect } from 'react';
import styles from './Device.module.scss';
import axios from 'axios';
import { useUser } from '@/components/User/UserState';
import { Button, Form, Modal, Input, Table, Tooltip, message, Typography, Popconfirm } from 'antd';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;

  // 禁止编辑以下列
  if(["id", "create_time", "operation", "delete"].includes(dataIndex)) {
    return <td {...restProps}>{children}</td>;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

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
  const { state, dispatch } = useUser();

  const [editingId, setEditingId] = useState(""); // 新增state来跟踪正在编辑的行的id

  const [initialFormValues, setInitialFormValues] = useState({});
  const [form] = Form.useForm();
  const isEditing = (record) => record.id === editingId;  // 判断当前记录是否在编辑

  const edit = (record) => {
      form.setFieldsValue({
        ...record
      });
      setEditingId(record.id);
  };

  const cancel = () => {
    setEditingId('');
  };

  const save = async (id) => {
    try {
      const row = await form.validateFields(); // 获取当前行的值
      // 这里应当处理row的数据，比如将它发送到服务器。我们可以直接传递给handleAlterSubmit
      handleAlterSubmit(row, id);
    } catch (err) {
      console.log('Validate Failed:', err);
    }
  };

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
  const handleCreateSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/createDevice', {
        token: state.token,
        name: values.name,
        code: values.code,
        description: values.description,
        user: state.username,
      });
      if(response.data.code === 0) {
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
  const handleAlterSubmit = async (row, id) => {
    try {
      const response = await axios.post('http://localhost:5000/alterDevice', {
        id: alterData.id,
        token: state.token,
        code: alterData.code,
        newName: alterData.name,
        oldName: alterData.oldName,
        description: alterData.description,
      });
      if(response.data.code === 0) {
          getDevice();  // 重新获取设备列表
          setVisibleAlter(false);  // 关闭修改的模态框
        } else {
          message.error('设备修改失败: ' + response.data.msg);
        }
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
        title: '修改',
        dataIndex: 'operation',
        render: (text, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span>
              <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
                保存
              </Typography.Link>
              <Popconfirm title="确定取消?" onConfirm={cancel}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
            <Typography.Link disabled={editingId !== ''} onClick={() => edit(record)}>
              编辑
            </Typography.Link>
          );
        },
      },
      {
        title: '删除',
        dataIndex: 'delete',
        render: (text, record) => (
          <Popconfirm title="确定删除?" onConfirm={() => deleteDevice(record.name)}>
            <a>删除</a>
          </Popconfirm>
        ),
      },
    ];
  const mergedColumns = columns.map((col) => {
    return {
      ...col,
      onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: col.dataIndex !== 'option' && isEditing(record),
        }), //这个不能删，删了就没法改了
    };
  });
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
                    <Input />
                </Form.Item>
                <Form.Item label="数据流" name="code" rules={[{ required: true, message: '请输入数据流!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="描述" name="description">
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
                    <Button type="primary" htmlType="submit">
                        确认
                    </Button>
                </Form.Item>
            </Form>
        </Modal>

       <Form form={form} component={false} initialValues={initialFormValues}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={deviceList}
          columns={mergedColumns}
          rowClassName="editable-row"
          rowKey="id"  // 确保有一个唯一的rowKey
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
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
