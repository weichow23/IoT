/* eslint-disable */
import './App.scss'
import './global.scss'
import '@arco-design/web-react/dist/css/arco.css'
import React, { useState } from 'react'
import { Context, StoreContext } from '@/store'
import { Foot } from '@/components/Foot/Foot'
import reportWebVitals from './reportWebVitals';
import GlobalsStyles from './globalStyles';
import Menu from './components/menu/Navbar';
import { FloatButton } from 'antd';

function App() {
  const [theme, _setTheme] = useState('light') // 'light' / 'dark'
  const [context] = useState(new Context())
  const rootStore = context.store
  return (
    
    <StoreContext.Provider value={context}>
      <React.StrictMode><GlobalsStyles /><Menu /></React.StrictMode>
      <div  className={'body'}>
      </div>
      <FloatButton.BackTop />
      <Foot />
    </StoreContext.Provider>
  )
}

export default App;
