/* eslint-disable */
import styles from './User.module.scss'
import { UserInfo } from '@/components/User/UserInfo'
import { Typography,Card,Image,Space, Button} from 'antd';
const { Title,Paragraph } = Typography;

export const User = ({onLogout }) => {
  const handleLogout = () => {
    // 从localStorage中移除token
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className={styles['layout']}>
      {/*<Space direction="vertical" size={16}>*/}

        <Card
            // title="Contact Us"
              bordered={true} hoverable={true} style={{width: '90%', margin: '0 auto'  }}><>
            <UserInfo/>
            <Button size="large"
                  type="primary"
                  htmlType="submit"
                  className={styles['login-button']} // 使用定义的样式
                  style={{ width: '120px'}}
                  onClick={handleLogout} >
                  退出登录
            </Button>
          </>
        </Card>
      {/*</Space>*/}
    </div>
  )
}

