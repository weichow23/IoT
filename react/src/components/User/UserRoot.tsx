/* eslint-disable */
import styles from './User.module.scss'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Typography,Card,Image,Form, Button, Table, message, Input, Popconfirm} from 'antd';
const { Title,Paragraph } = Typography;
import { md5 } from 'js-md5';
export const UserRoot = ({onLogout }) => {
  const handleLogout = () => {
    // 从localStorage中移除token
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    }
  };
  const [editingId, setEditingId] = useState("");

 const isEditing = (record) => record.id === editingId;
 const [form] = Form.useForm();
 const EditableCell = ({ editing, dataIndex, title, children, ...restProps }) => {
    // 只有当 editing 为 true 并且 dataIndex 为 'password' 时，我们才渲染输入框
    const isPasswordCell = dataIndex === 'password';

    return (
        <td {...restProps}>
            {editing && isPasswordCell ? (
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
                    <Input.Password placeholder="新密码" />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


  const handleEditPassword = (record) => {
    form.setFieldsValue({
      name: record.name,
      token: record.token,
      password: record.password
    });
    setEditingId(record.id);
};


  const handleSavePassword = async (record) => {
  try {
    const values = await form.validateFields();
    const response = await axios.post('http://localhost:5000/alterPassword', {
      oldPsw: md5(record.password),
      newPsw: md5(values.password), // 使用password作为字段名
      token: record.token,
    });
    if (response.data.code === 0) {
      message.success("修改成功");
      setEditingId('');
    } else {
      message.error("修改失败");
    }
  } catch (error) {
    message.error("修改失败");
  }
};

  const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getAllUser');
                if (response.data.code === 0) {
                    setUsersData(response.data.users);
                } else {
                    console.error('Failed to fetch users data.');
                }
            } catch (error) {
                console.error('Error fetching users data:', error);
            }
        };
        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Token',
            dataIndex: 'token',
            key: 'token',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            render: (text, record) => (isEditing(record) ? (
              <Form.Item
                name="password"
                style={{ margin: 0 }}
                rules={[
                  {
                    required: true,
                    message: "请输入新密码!",
                  },
                ]}
              >
                <Input.Password placeholder="新密码" />
              </Form.Item>
            ) : '********'),
        },
        {
            title: 'Change Password',
            key: 'changePassword',
            render: (text, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => handleSavePassword(record)}>保存</Typography.Link>
                        <Popconfirm title="确定取消?" onConfirm={() => setEditingId('')}>
                            <Typography.Link style={{ marginLeft: 10 }}>取消</Typography.Link>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link onClick={() => handleEditPassword(record)}>修改密码</Typography.Link>
                );
            },
        }
    ];

  return (
    <div className={styles['layout']}>
        <Card bordered={true} hoverable={true} style={{width: '90%', margin: '0 auto'  }}><>
            <Title level={3}>所有注册用户信息</Title>
            <Form form={form} component={false}>
              <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  dataSource={usersData}
                  columns={columns}
                  rowClassName="editable-row"
                  rowKey="id"
                  pagination={{
                    onChange: () => setEditingId(''), pageSize: 10,
                  }}
                />
            </Form>
            <Button size="large"
                  type="primary"
                  htmlType="submit"
                  className={styles['login-button']}
                  style={{ width: '120px'}}
                  onClick={handleLogout} >
                  退出登录
            </Button>
          </>
        </Card>
    </div>
  )
}
