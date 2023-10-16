/* eslint-disable */
import styles from './Test.module.scss'
import { Button, Input, Modal, Upload } from '@arco-design/web-react'
import { useState } from 'react'
import axios from 'axios'

export const Test = ({ a }) => {
  const [visible2, setVisible2] = useState(false)
  const [userInput, setUserInput] = useState('')

  const post = async () => {
    await axios
      .post('http://localhost:5050/test', {
        userName: 'zmx',
        age: 10,
      })
      .then((back_end_data) => {
        console.log(back_end_data)
        return
      })
      .catch((res) => console.log(res))
  }
  return (
    <div>
      <Button
        style={{ width: 200, opacity: a === 1 ? 1 : 0 }}
        type={'primary'}
        onClick={() => setVisible2(true)}
      >
        {`弹窗Trigger${a}`}
      </Button>
      <Modal
        title="Modal Title"
        visible={visible2}
        onOk={() => {
          console.log('a')
          setVisible2(false)
        }}
        onCancel={() => setVisible2(false)}
        autoFocus={false}
        focusLock={true}
        footer={null}
      >
        <div className={styles['layout']}>
          <Input
            style={{ marginTop: 20 }}
            onChange={(value) => setUserInput(value)}
          />
          <Upload style={{ marginTop: 20 }} />
          <Button
            style={{ marginTop: 20 }}
            onClick={() => post()}
          >
            11
          </Button>
        </div>
      </Modal>
    </div>
  )
}
