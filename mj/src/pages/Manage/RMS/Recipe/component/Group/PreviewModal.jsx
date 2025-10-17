import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useMemo, useState} from 'react'
import {
  exportRecipeFile,
} from '@/apis/rms.js'
import {ParseSop} from '../ParseSop.js'
import SOP from '@/pages/Manage/RMS/Recipe/component/Group/SOP.jsx'

const PreviewModal = ({open, setOpen, docRow}) => {
  const [parsedFileInfo, setParsedFileInfo] = useState({})
  const convertBase642Blob = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes]);
  }
  const handleFile2JSON = () => {
    const {RecipeFileId, RecipeFileName} = docRow
    exportRecipeFile({RecipeFileId})
    .then(async ({Data}) => {
      if (Data) {
        const blob = convertBase642Blob(Data);
        const file = new File([blob], RecipeFileName)
        const parsedFileInfo = await ParseSop(file)
        setParsedFileInfo(parsedFileInfo)
      } else {
        message.error('配方文件不存在，预览失败！')
      }
    })
  }
  useEffect(() => {
    if (open) {
      handleFile2JSON()
    }
  }, [open])
  return (
    <Modal
      title={'配方文件预览'}
      open={open}
      onOk={() => handleOk()}
      footer={null}
      onCancel={() => setOpen(false)}
      width={1100}>
      <SOP {...parsedFileInfo} />
    </Modal>
  )
}
export default PreviewModal;
