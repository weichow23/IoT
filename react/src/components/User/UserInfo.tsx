/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Card, Avatar, Divider, Row, Col, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './User.module.scss';
import ReactIcon from '@/assets/react.svg';
import { useUser } from '@/components/User/UserState';
import axios from 'axios';
import { md5 } from 'js-md5';
interface UserProps {
  // Define any props here
}

export const UserInfo: React.FC<UserProps> = ({ }) => {
  const { state } = useUser(); //全局变量 email和token
  const { dispatch } = useUser();

  const [nickname, setNickname] = useState<string>('Anonymous');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const nicknameInputRef = useRef<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3790/getUser', {
                params: {
                    token: state.token,
                }
            });
            if (response.data.code === 0 || response.data.code === 1)  {
                setNickname(response.data.data);
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

  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3790/alterName', {
        newName: nickname,
        token: state.token,
      });

      if (response.data.code === 0) {
        message.success(response.data.msg);
      } else {
        message.error("修改失败");
      }
    } catch (error) {
      message.error("修改失败");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reg = /^[0-9a-zA-Z]+$/;

    if (!reg.test(password2)) {
      message.error("密码只能由数字和字母组成");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3790/alterPassword', {
        oldPsw: md5(password1), // 使用MD5哈希
        newPsw: md5(password2), // 使用MD5哈希
        token: state.token,
      });

      if (response.data.code === 0) {
        message.success("修改成功");
      } else if (response.data.code === -2) {
        message.error("旧密码错误");
      } else {
        message.error("修改失败");
      }
    } catch (error) {
      message.error("修改失败");
    }
  };

  return (
    <div>
      <Card hoverable style={{ width: '100%' }} bordered={false}>
        <Card.Meta
          title={nickname}
          description={'工作单位：浙江大学'} // 使用全局变量 state.email
          avatar={<Avatar src={ReactIcon} size={64} />}
        />
      </Card>
      <Divider dashed />
      <Row>
        <Col span={6}>更改名称:</Col>
        <Col span={6}>
          <Input
            ref={nicknameInputRef}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={nickname}
            prefix={<UserOutlined />}
          />
        </Col>
        <Col span={6}>
          <Button type="dashed" style={{ marginLeft: '10px' }} onClick={handleNicknameSubmit}>修改</Button>
        </Col>
        <Col span={6} />
      </Row>
      <br />
      <Row>
        <Col span={6}>更改密码:</Col>
        <Col span={6}>
          <Input.Password
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            placeholder="原密码"
          />
        </Col>
        <Col span={6} />
        <Col span={6} />
      </Row>
      <br />
      <Row>
        <Col span={6}></Col>
        <Col span={6}>
          <Input.Password
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="新密码"
          />
        </Col>
        <Col span={6}>
          <Button type="dashed" style={{ marginLeft: '10px' }} onClick={handlePasswordSubmit}>修改</Button>
        </Col>
        <Col span={6} />
      </Row>
    </div>
  );
};
