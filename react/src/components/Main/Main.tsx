/* eslint-disable */
import styles from './Main.module.scss'
import { Typography,Card,Image,Space,Button} from 'antd';
const { Title } = Typography;
const { Text, Link,Paragraph } = Typography;
import IcLogo from '../../assets/zju.png'
import { Carousel } from '@arco-design/web-react';
const imageSrc = [
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
  '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp',
];

export const Main = ({ }) => {
  return (
    <div className={styles['layout']}>
      <Space direction="vertical" size={16}>
        <Card title="About IoT" bordered={true} hoverable={true} style={{width: '90%', margin: '0 auto'  }}><>
        <Title level={5}>欢迎使用物联网管理平台</Title>
        <br/>
</>

    <Carousel
          style={{ width: '89%', height: '40%' , margin: '0 auto' }}
          autoPlay={true}
          indicatorType='dot'
          showArrow='hover'
        >
          {imageSrc.map((src, index) => (
            <div key={index}>
              <img
                src={src}
                style={{ width: '100%' }}
              />
            </div>
          ))}
    </Carousel>
</Card>

<Card title="Contact Us" bordered={true} hoverable={true} style={{width: '90%', margin: '0 auto'  }}><>
    <Title level={5}>
    如果你有任何问题，请联系本网站的开发者： 周炜 at <Paragraph style={{ display: 'inline' }} copyable={{ tooltips: false }}>3210103790@zju.edu.cn</Paragraph>  or <Paragraph style={{ display: 'inline' }} copyable={{ tooltips: false }}>zhouwei@hku.hk</Paragraph>
    </Title>
    <div className={styles['image-container']}>
      <a href="https://www.zju.edu.cn/" target="_blank">
        <Image
          width={120}
          src={IcLogo}
          preview={false}
        />
      </a>
    </div>
  </>
</Card>

      </Space>
    </div>
  )
}