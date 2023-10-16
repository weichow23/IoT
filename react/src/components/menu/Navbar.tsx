/* eslint-disable */
import { Nav, Logo } from './styles'

import IcLogo from '../../assets/logo.png'
import Burger from './Burger'


import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
  Link,
} from 'react-router-dom'

type Props = {
  children?: ChildNode
}

export default function Navbar(props: Props) {
  return (
    <>
      <Nav>
        <Logo src={IcLogo} alt='Gustavo Scarpim' />
        {/* <Link to="https://www.baidu.com"><Logo src={IcLogo} alt='Gustavo Scarpim' /></Link> */}
      </Nav>
      <Burger />
      {props.children}
    </>
  )
}


