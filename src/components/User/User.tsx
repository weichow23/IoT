/* eslint-disable */
import styles from './User.module.scss'
import IcLogo from "@/assets/zju.png";
import { UserInfo } from '@/components/User/UserInfo'
import { Typography,Card,Image,Space} from 'antd';
const { Title,Paragraph } = Typography;

export const User = ({ }) => {
  return (
    <div className={styles['layout']}>
      {/*<Space direction="vertical" size={16}>*/}

        <Card
            // title="Contact Us"
              bordered={true} hoverable={true} style={{width: '90%', margin: '0 auto'  }}><>
            <UserInfo/>
          </>
        </Card>

      {/*</Space>*/}
    </div>
  )
}

