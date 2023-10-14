/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Card, Avatar, Divider, Row, Col, Input, Button, message } from 'antd';
import { Input as AntdInput } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './User.module.scss';
import ReactIcon from '@/assets/react.svg';

interface UserProps {
  // Define any props here
}

export const UserInfo: React.FC<UserProps> = ({ }) => {
  const [nickname, setNickname] = useState<string>('User0001');
  const [email, setEmail] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const nicknameInputRef = useRef<any>(null);


  useEffect(() => {
    // Fetch user data here, for example:
    // fetch('/api/getUser').then((response) => response.json()).then((data) => setNickname(data.data));
    // Set email from a global state or another API call
  }, []);

  const handleNicknameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // API call to update nickname here
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reg = /^[0-9a-zA-Z]+$/;

    if (!reg.test(password2)) {
      message.error("Password can only contain numbers and letters.");
      return;
    }

    // API call to update password here
  };

  return (
    <div>
      <Card hoverable style={{ width: '100%' }} bordered={false}>
        <Card.Meta
          title={nickname}
          description={email}
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
          <Button type="dashed" style={{ marginLeft: '10px' }} onClick={handleNicknameSubmit}>Submit</Button>
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
          <Button type="dashed" style={{ marginLeft: '10px' }} onClick={handlePasswordSubmit}>Submit</Button>
        </Col>
        <Col span={6} />
      </Row>
    </div>
  );
};
