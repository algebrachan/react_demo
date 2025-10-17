import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useMemo, useState} from 'react'
import {ParseCsvString} from '../ParseSop.js'
import SOP from '@/pages/Manage/RMS/Recipe/component/Overview/SOP.jsx'
import {exportRecipeTemplateFile} from '@/apis/rms.js'
import * as XLSX from 'xlsx'
import {ArrowLeftOutlined} from '@ant-design/icons'
import styles from '../../style/index.module.less'

const DetailModal = ({open, setOpen, row, areaList}) => {
  const [parsedFileInfo, setParsedFileInfo] = useState({})
  const {DeviceId, DisplayName, AreaId, SetRecipeTemplate, DeviceTypeId} = row
  const {TemplateId, TemplateName} = (SetRecipeTemplate ?? {})
  const deviceData = useMemo(() => {
    return {AreaId, DeviceId, DeviceName: DisplayName, TemplateName, DeviceTypeId}
  }, [row])
  const handleFile2JSON = () => {
    exportRecipeTemplateFile(TemplateId)
    .then(({Data}) => {
      if (Data) {
        const workbook = XLSX.read(Data, {type: 'base64'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const csvString = XLSX.utils.sheet_to_txt(worksheet);
        setParsedFileInfo(ParseCsvString(csvString))
      } else {
        message.error('配方文件不存在，预览失败！')
      }
    })
  }
  useEffect(() => {
    if (open) handleFile2JSON()
  }, [open])
  return (
    <div className={styles['rms-recipe-overview__detail']}>
      <Button style={{marginBottom: 8}} variant={'outlined'} color={'primary'} icon={<ArrowLeftOutlined />} onClick={() => setOpen(false)}>返回</Button>
      <SOP
        scroll={{y: `calc(100vh - 436)`}}
        fileData={parsedFileInfo}
        areaList={areaList}
        deviceData={deviceData}
      />
    </div>
  )
}
export default DetailModal;
