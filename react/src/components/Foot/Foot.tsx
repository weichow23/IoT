/* eslint-disable */
import { Layout } from '@arco-design/web-react';
const Footer = Layout.Footer;
import styles from './Foot.module.scss'
import { Space,Typography } from 'antd';
const { Text, Link } = Typography;


import { GithubOutlined } from '@ant-design/icons';

export const Foot = ({ }) => {
  const Footer = Layout.Footer;
  return (
      <div className={styles['layout']}>
      <Layout>
        <center>
      <Footer> </Footer>
      <Footer> @2023 Made with ❤️ by zhouwei(3210103790) </Footer>
      <Footer> <Link href="https://github.com/zjuerme/IoT" target="_blank"><GithubOutlined style={{ fontSize: '16px', color: '#08c' }}/> Github</Link> </Footer>
        </center>
      </Layout>
    </div>
  )
}


