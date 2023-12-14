/* eslint-disable */
import { Ul, Li, LogoUl} from './styles'
import Logo from '../../assets/logo.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faHome, faPersonCircleQuestion, faUser, faServer} from '@fortawesome/free-solid-svg-icons';
import { Device } from '@/components/Device/Device'
import { DeviceRoot } from '@/components/Device/DeviceRoot'
import { Main } from '@/components/Main/Main'
import { User } from '@/components/User/User'
import { UserRoot } from '@/components/User/UserRoot'
import { QA } from '@/components/Main/QA'
import { Login } from '@/components/Login/Login'
import React, { useState } from 'react';
import { UserProvider } from '@/components/User/UserState'
import { useUser } from '@/components/User/UserState';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from 'react-router-dom'

type Props = {
  open: boolean
}

function RightNav(props: Props) {
  const [showUser, setShowUser] = useState(true);//是否显示登录页面
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { state } = useUser();
  const [isRoot, setIsRoot] = useState(false); // 添加新的状态isRoot

  // token存在则自动登录，否则就退出; 管理员模式由于安全性的考虑不会自动保存登录状态
  React.useEffect(() => {
      const token = localStorage.getItem('token');
      // if (token && state.token) {
        if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }, []);

  const handleLoginSuccess = (status) => {
    setIsAuthenticated(status.isAuthenticated);
    setIsRoot(status.isRoot);
  };

  return (
  <UserProvider>
    <Router>
      <Ul open={props.open}>
      {/* <div className={styles['LogoUl']}><img src='og.png'/></div> */}
        <LogoUl src={Logo} alt={'Gustavo Scarpim'} />

        <NavLink
          exact
          to='/'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <Li><FontAwesomeIcon icon={faHome} /> 主页 </Li>
        </NavLink>
        

        <NavLink
          to='/Device'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <Li><FontAwesomeIcon icon={faServer} /> 设备管理</Li>
        </NavLink>

        <NavLink
          to='/User'
          onClick={() => {
            setShowUser(!showUser);
          }}
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
            // backgroundColor: 'black'
          }}
        ><Li><FontAwesomeIcon icon={faUser} /> 用户中心 </Li>

        </NavLink>
        <NavLink
          to='/QA'
          activeStyle={{
            fontWeight: 'bold',
            color: '#0DADEA',
          }}
        >
          <Li><FontAwesomeIcon icon={faPersonCircleQuestion} /> 问题</Li>
        </NavLink>
      </Ul>
      <Switch>
        <Route exact path='/'>
          <Main />
        </Route>        

        <Route exact path='/Device'>
          {isAuthenticated ? (
              isRoot ? <DeviceRoot /> :
                <Device />) :
              <Login onLoginSuccess={handleLoginSuccess} />}
        </Route>
        <Route exact path='/QA'>
          <QA />
        </Route>
        <Route exact path='/User'>
          {isAuthenticated ? (
              isRoot ? <UserRoot onLogout={() => setIsAuthenticated(false)} /> :
                <User onLogout={() => setIsAuthenticated(false)} />) :
              <Login onLoginSuccess={handleLoginSuccess} />}
        </Route>
        <Redirect to='/' />
      </Switch>
    </Router>
  </UserProvider>
  )
}

export default RightNav