/* eslint-disable */
import { Ul, Li, LogoUl} from './styles'
import Logo from '../../assets/logo.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faHome, faPersonCircleQuestion, faUser, faServer} from '@fortawesome/free-solid-svg-icons';
import { Device } from '@/components/Device/Device'
import { Main } from '@/components/Main/Main'
import { User } from '@/components/User/User'
import { QA } from '@/components/Main/QA'
import { Login } from '@/components/Login/Login'
import React, { useState } from 'react';
import { UserProvider } from '@/components/User/UserState'

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

  // token存在则自动登录，否则就退出
  React.useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }, []);

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
          {isAuthenticated ? <Device /> : <Login onLoginSuccess={() => setIsAuthenticated(true)} />}
        </Route>
        <Route exact path='/QA'>
          <QA />
        </Route>
        <Route exact path='/User'>
          {isAuthenticated ? <User onLogout={() => setIsAuthenticated(false)} /> : <Login onLoginSuccess={() => setIsAuthenticated(true)} />}
        </Route>
        <Redirect to='/' />
      </Switch>
    </Router>
      </UserProvider>
  )
}

export default RightNav
