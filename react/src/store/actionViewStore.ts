/* eslint-disable */
import { RootStore } from '@/store'
import { makeAutoObservable, runInAction } from 'mobx'

export default class ActionViewStore {
  public rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore

    makeAutoObservable(this, {}, { autoBind: true })
  }
}
