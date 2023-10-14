/* eslint-disable */
import React, { useState } from 'react';
import { Form, Input, Button, Tabs, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import styles from './Login.module.scss';
import logo from '@/assets/react.svg';
import logo_root from '@/assets/root.svg';
import axios from 'axios';
import { md5 } from 'js-md5';

export const Login =  ({ onLoginSuccess }) => {
  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState('login');

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      if (tabKey === 'login') {
        const { email, password } = values;
        const encryptedPassword = md5(password);

        axios.post(' http://localhost:5000/login', { email:email, password: encryptedPassword })
          .then((response) => {
            if(response.data.code === 0) {
              alert("登录成功");
              onLoginSuccess();
            } else {
              alert("登录失败");
            }
          }).catch((error) => {
            if (error.response) {
              // 请求已发送，服务器也已响应（状态码在2xx之外）
              console.log('Data:', error.response.data);
              console.log('Status:', error.response.status);
              console.log('Headers:', error.response.headers);
            } else if (error.request) {
              // 请求已发送，但没有收到响应
              console.log('Request data:', error.request);
            } else {
              // 在设置请求时触发某些事情，触发了一个错误
              console.log('Error message:', error.message);
            }
            alert("请求失败");
          });
      }
      else if (tabKey === 'register') {
        const { username, registerEmail, registerPassword } = values;
        const encryptedPassword = md5(registerPassword);

        axios.post('http://localhost:5000/register', {
          email: registerEmail,
          password: encryptedPassword,
          name: username,
        }).then((response) => {
          alert(response.data.msg);
        }).catch((error) => {
          console.log(error);
          alert("请求失败");
        });
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const handleTabChange = (key: string) => {
    setTabKey(key);
    form.resetFields();
  };

  return (
    <div className={styles.Li} style={{ height: '100vh' }}>
      <Card className={styles.login_form} hoverable={true}>
        <div className={styles.login_head}>
          <img className={styles.logo} src={tabKey === 'admin' ? logo_root : logo} alt="Logo" />
          <div className={styles.title}>IoT 物联网设备管理系统</div>
        </div>
        <Form
          id="formLogin"
          className="user-layout-login"
          form={form}
          onFinish={handleSubmit}
        >
          <Tabs
            defaultActiveKey="login"
            centered
            onChange={handleTabChange}
          >
            <Tabs.TabPane key="login" tab="登录">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入正确的邮箱' }
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="邮箱地址"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { pattern: /^[A-Za-z0-9]{6,}$/, message: '密码只能由数字和字母组成且不少于6位' }
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码"
                />
              </Form.Item>
              <Form.Item style={{ marginTop: '24px' , textAlign: 'center' }}>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  className="login-button"
                  style={{ width: '150px'}}
                  block
                >
                  登录
                </Button>
              </Form.Item>
            </Tabs.TabPane>

            <Tabs.TabPane key="register" tab="注册">
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { pattern: /^[A-Za-z0-9_]{4,}$/, message: '用户名只能由数字、字母和下划线组成且不少于4位' }
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />
              </Form.Item>
              <Form.Item
                name="registerEmail"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入正确的邮箱' }
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="邮箱地址"
                />
              </Form.Item>
              <Form.Item
                name="registerPassword"
                rules={[
                  { required: true, message: '请输入密码' },
                  { pattern: /^[A-Za-z0-9]{6,}$/, message: '密码只能由数字和字母组成且不少于6位' }
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={['registerPassword']}
                hasFeedback
                rules={[
                  { required: true, message: '请确认你的密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('registerPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不匹配!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="确认密码"
                />
              </Form.Item>
              <Form.Item style={{ marginTop: '24px' , textAlign: 'center' }}>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  className="register-button"
                  style={{ width: '150px'}}
                  block
                >
                  注册
                </Button>
              </Form.Item>
            </Tabs.TabPane>

            <Tabs.TabPane key="admin" tab="管理员">
              <Form.Item>
                <Input.Password
                  size="large"
                  prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="密码"
                />
              </Form.Item>
              <Form.Item style={{ marginTop: '24px' , textAlign: 'center' }}>
                <Button
                  size="large"
                  type="primary"
                  htmlType="submit"
                  className="login-button"
                  style={{ width: '150px'}}
                  block
                >
                  登录
                </Button>
              </Form.Item>
            </Tabs.TabPane>

          </Tabs>
        </Form>
      </Card>
    </div>
  );
};

