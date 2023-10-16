/* eslint-disable */
import { makeAutoObservable } from 'mobx'
import PlayerViewStore from '@/store/playerViewStore'
import ActionViewStore from '@/store/actionViewStore'
import { createContext } from 'react'

export class RootStore {
  playerView = new PlayerViewStore(this)
  actionView = new ActionViewStore(this)
  constructor() {
    makeAutoObservable(this)
  }
}

export class Context {
  public store: RootStore

  public constructor() {
    this.store = new RootStore()
    makeAutoObservable(this)
  }
}

export const StoreContext = createContext<Context>(null as unknown as Context)
