/* eslint-disable */
// 日志，左边的图片应该设置不了链接，首先它是在Navbar中的那个组件，其次没有router，简单的想法是跳到github，但是搞了好久也没有成功.还会有各种奇怪问题
// 估计是被<Nav>给屏蔽了
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
  return (
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
          <Device />
        </Route>
        <Route exact path='/QA'>
          <QA />
        </Route>
        <Route exact path='/User'>
          {showUser ? <User /> : <Login />}
        </Route>
        <Redirect to='/' />
      </Switch>
    </Router>
  )
}

export default RightNav
