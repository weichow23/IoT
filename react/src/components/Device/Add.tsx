/* eslint-disable */
import styles from './Add.module.scss'
import { Button, Input, Modal,Space } from '@arco-design/web-react'
import { IconSend } from '@arco-design/web-react/icon';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faFileUpload} from '@fortawesome/free-solid-svg-icons';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import JSZip from 'jszip';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'antd';

// 使用<Add visible2={visible2} setVisible2={setVisible2} />
interface AddProps {
  visible2: boolean;
  setVisible2: (visible: boolean) => void;
}
export const Add = ({ visible2, setVisible2 }: AddProps) =>{
  function success() {
    Modal.success({
    title: 'This is a success notification',
    okText: 'ok',
    style: { width: 290 },
    content:
      'You have submitted successfully! And we will reply to you soon.',
    });
  }
  // const [visible2, setVisible2] = useState(false)
  const [userInput, setUserInput] = useState('')
  const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error',
    },
  ]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
  if (file.status === 'done') {
    const updatedFileList = newFileList.map((item) => (item.uid === file.uid ? file : item));
    setFileList(updatedFileList);
  } else {
    setFileList(newFileList);
  }
};

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    // 在 fileList 更新时检查文件类型
    useEffect(() => {
      const isFileTypeValid = fileList.every((file) => {
        const fileExtension = file.name.slice((Math.max(0, file.name.lastIndexOf('.')) || Infinity) + 1);
        return allowedFileTypes.includes(`.${fileExtension}`);
      });

      setIsSubmitDisabled(!isFileTypeValid);
    }, [fileList]);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Select File(Including your code)</div>
    </div>
  );
  const beforeUpload = (file) => {
    const fileExtension = file.name.slice((Math.max(0, file.name.lastIndexOf('.')) || Infinity) + 1);
    const isValidFileType = allowedFileTypes.includes(`.${fileExtension}`);

    if (!isValidFileType) {
      Modal.error({
        title: 'Invalid File Type',
        content: `The selected file type is not allowed. Please upload one of the following file types: ${allowedFileTypes.join(', ')}`,
      });
    }

    return isValidFileType ? false : Upload.LIST_IGNORE; // 返回 false 以取消文件的自动上传
  };
  const customRequest = async (options) => {
    const { onSuccess, onError, file } = options;

    // 模拟文件上传过程
    setTimeout(async () => {
      const fileExtension = file.name.slice((Math.max(0, file.name.lastIndexOf('.')) || Infinity) + 1);
      if (fileExtension === 'png') {
        file.url = await getBase64(file); // 为成功上传的文件设置 url 属性
        onSuccess("File uploaded successfully");
      } else {
        onError(new Error("File upload failed"));
      }
    }, 1000);
  };
  const uploadRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [disableClose, setDisableClose] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: React.ReactNode } | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<React.ReactNode>('is trying to upload');
  const allowedFileTypes = [
    '.zip',
    '.pdf',
    '.txt',
    '.md',
    '.doc',
    '.docx',
    '.png',
    '.jpg',
    '.JPEG',
    '.jpeg',
    '.JPG',
  ];
  const UploadModal = () => (
    <Modal
      title="Uploading"
      visible={uploadModalVisible}
      onCancel={() => {
        if (uploadMessage !== 'is trying to upload') setUploadModalVisible(false);
      }}
      footer={null}
      style={{ width: '20%' ,height: 'calc(25% - 35px)',textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        top: '40%',
        alignItems: 'center'}}
      closeIcon={uploadMessage === 'is trying to upload' ? null : undefined}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {uploadMessage}
      </div>
    </Modal>
  );
  async function handleSubmit() {
    setIsLoading(true);
    // 检查 <Input> 和 <Upload> 中是否输入了文本和上传了文件
    if (!userInput || fileList.length === 0) {
      setUploadMessage('The uploaded file cannot be empty or not entered into your email address');
      setUploadModalVisible(true);
      setIsLoading(false);
      return;
    }

    setUploadMessage('is trying to upload');
    setUploadModalVisible(true);

    const zip = new JSZip();
    fileList.forEach((file) => {
      zip.file(file.name, file.originFileObj);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    const formData = new FormData();
    formData.append('file', zipBlob, `${userInput}.zip`);
    formData.append('file_name', `${userInput}.zip`);

    try {
      const response = await fetch('http://47.120.11.22:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsLoading(false);
        setUploadMessage(
          <>
            <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />
            Success
          </>
        );
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      setIsLoading(false);
      setUploadMessage(
        <>
          <CloseCircleOutlined style={{ color: 'red', marginRight: 8 }} />
          Error: {error.message}
        </>
      );
    }
  }
  return (
    <div>
      <div className={styles['Li']} style={{ height: '100vh', whiteSpace: 'nowrap' }}>
        &nbsp;
      </div>

      <Modal
        title="Modal Title"
        visible={visible2}
        onOk={() => {
          setVisible2(false)
        }}
        onCancel={() => setVisible2(false)}
        autoFocus={false}
        focusLock={true}
        footer={null}
      >
        <div className={styles['layout']}>
          <Input
            style={{ marginTop: 20, marginLeft:30, marginRight:30,width: 300 }}
            onChange={(value) => setUserInput(value)}
            allowClear placeholder='Please Enter Your Email'
          />
          {/* <Upload style={{ marginTop: 20 }} /> */}
          <p></p>
          <center>
            <div className='upload-demo-trigger'></div>
            <Upload
              ref={uploadRef}
              listType="picture-card"
              onPreview={handlePreview}
              onChange={handleChange}
              beforeUpload={beforeUpload}
              customRequest={customRequest} // 添加 customRequest 函数
              style={{ width: 200 }}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </center>
          <Modal  title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <p></p>

          <Space size="large">
            <Button type="primary" icon={<IconSend />} status="success" onClick={handleSubmit} disabled={isSubmitDisabled}>
              Log In
            </Button>
          </Space>
        </div>
      </Modal>
      <UploadModal />
    </div>
  )
}