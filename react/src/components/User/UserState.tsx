/* eslint-disable */
import React, {createContext, Dispatch, useReducer, useContext, ReactNode, Reducer } from 'react'

interface UserState {
  username: string | null
  email: string | null
  token: string | null
}

interface UserAction {
  type: string
  payload?: any
}

const defaultState: UserState = {
  username: null,
  email: null,
  token: null,
}

const defaultDispatch: Dispatch<UserAction> = () => null

export const UserContext = createContext({
  state: defaultState,
  dispatch: defaultDispatch,
})

// 定义一个reducer，用于更新context中的状态
const reducer = (state, action) => {
  switch (action.type) {
    case 'setEmail':
      return { ...state, email: action.payload }
    case 'setToken':
      return { ...state, token: action.payload }
    case 'setUsername':
      return { ...state, username: action.payload }
    default:
      return state
  }
}

// 创建一个provider组件
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const initialState = {
    username: null,
    email: null,
    token: null,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}

// 自定义hook用于在组件中更方便的使用user context
export const useUser = () => {
  return useContext(UserContext)
}
