import {Button, Descriptions, Form, Input, message, Modal, Table, Tabs} from 'antd'
import {useEffect, useMemo, useState} from 'react'
import {CloudDownloadOutlined, CloudOutlined, CloudUploadOutlined, DownloadOutlined, SaveOutlined, SyncOutlined} from '@ant-design/icons'
import styles from '../../style/index.module.less'
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import {EncodeCSVString, EncodeUTF16LEWithBOM} from '@/pages/Manage/RMS/Recipe/component/ParseSop.js'

const SOP = ({fileData = {}, scroll = {}, deviceData, areaList}) => {
  const EAP_IP = useMemo(() => {
    const {AreaId} = deviceData
    return areaList.find(item => item.AreaId === AreaId)?.IpAddress
  }, [deviceData, areaList])
  const fileInfo = useMemo(() => fileData.fileInfo ?? [], [fileData])
  const tableName = useMemo(() => fileData.tableName ?? [], [fileData])
  const columns = useMemo(() => fileData.columns ?? [], [fileData])
  const data = useMemo(() => fileData.data ?? [], [fileData])
  const [activeKey, setActiveKey] = useState('1')
  const [valueData, setValueData] = useState([])
  const [pointList, setPointList] = useState([])
  const [clickPointLocation, setClickPointLocation] = useState([])
  const [tbLoad, setTbLoad] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const [modalForm] = Form.useForm()
  const eapRequest = (url, data, isRead) => new Promise(resolve => {
    isRead && setTbLoad(true)
    fetch(url, {
      body: JSON.stringify(data),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    })
    .then(data => {
      if (data.code === '100') {
        resolve(isRead ? JSON.parse(data.result) : undefined);
      } else {
        message.error(`${isRead ? '获取' : '设置'}实时数据失败: ` + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      message.error(`${isRead ? '获取' : '设置'}实时数据失败: ` + error.message);
    })
    .finally(() => {
      isRead && setTbLoad(false)
    });
  })
  const handleSetPointList = () => {
    const newPointList = []
    tableName.forEach((_, tableIndex) => {
      const excludeColumnIndex = columns[tableIndex].reduce((acc, columnItem, columnIndex) => {
        ['序号', '步骤'].includes(columnItem) && acc.push(columnIndex)
        return acc
      }, [])
      const curTablePoint = data[tableIndex].reduce((acc, row, rowIndex) => {
        // 删除空单元格数据，保留纯数字，排除列名是步骤、序号所在列的值
        row.forEach((cell, columnIndex) => {
          const isValid = !excludeColumnIndex.includes(columnIndex) && /^\d+$/.test(cell)
          isValid && (acc[cell] = [rowIndex, columnIndex])
        })
        return acc
      }, {})
      newPointList.push(curTablePoint)
    })
    setPointList(newPointList)
  }
  const handleGetValue = async (isExport) => {
    const {DeviceId: StationId} = deviceData
    const curTableIndex = parseInt(activeKey) - 1
    const pointPositionList = isExport ?
      pointList.reduce((acc, curTablePoint) => {
        const curPoint = Object.keys(curTablePoint)
        acc.push(...curPoint)
        return acc
      }, []) :
      Object.keys(pointList[curTableIndex])
    const pointValue = await eapRequest(`http\:\/\/${EAP_IP}\/readdata`, {StationId, Data: pointPositionList}, true)
    const newValueData = data.map((curTableData, tableIndex) => {
      return curTableData.map((row, rowIndex) => {
        return row.map((cell, columnIndex) => {
          const curTablePointLocation = Object.values(pointList[tableIndex] ?? []).map((point) => point.join())
          const cellPointLocation = [rowIndex, columnIndex].join()
          if (curTablePointLocation.includes(cellPointLocation)) return pointValue[cell]
          else return cell
        })
      })
    })
    setValueData(newValueData)
    return newValueData
  }
  const handleExport = async () => {
    const {TemplateName} = deviceData
    const fileName = `${TemplateName}.csv`
    const newValueData = await handleGetValue(true)
    const csvString = EncodeCSVString({fileInfo, tableName, columns, data: newValueData})
    const blob = new Blob([EncodeUTF16LEWithBOM(csvString)], {type: 'text/csv;'})
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
  const formItems = deviceData.DeviceTypeId === 203 ?
    [[
      {span: 3, label: '设备名称', name: 'DeviceName', formItem: (<Input disabled />)},
      {span: 3, label: '配方模板', name: 'TemplateName', formItem: (<Input disabled />)},
      {span: 3, label: '编辑配方', name: 'RecipeEdit', formItem: (<Input />)},
      {
        span: 2, formItem: (
          <Button style={{width: 'auto'}} type={'primary'} onClick={async () => {
            const value = form.getFieldValue(['RecipeEdit'])
            await eapRequest(`http\:\/\/${EAP_IP}\/writedata`, {StationId: deviceData.DeviceId, Data: {['2093']: value}}, false)
            message.success('设置数据成功！')
          }}>确认</Button>
        )
      },
      {
        span: 7, formItem: (
          <div className={styles['rms-btn-group']} style={{justifyContent: 'flex-start'}}>
            <Button variant={'outlined'} color={'primary'} icon={<SaveOutlined />} onClick={async () => {
              await eapRequest(`http\:\/\/${EAP_IP}\/writedata`, {StationId: deviceData.DeviceId, Data: {['2260']: 'True'}}, false)
              await eapRequest(`http\:\/\/${EAP_IP}\/writedata`, {StationId: deviceData.DeviceId, Data: {['2260']: 'False'}}, false)
              message.success('设置数据成功！')
            }}>保存</Button>
            <Button variant={'outlined'} color={'primary'} icon={<CloudDownloadOutlined />} onClick={async () => {
              await eapRequest(`http\:\/\/${EAP_IP}\/writedata`, {StationId: deviceData.DeviceId, Data: {['2261']: 'True'}}, false)
              await eapRequest(`http\:\/\/${EAP_IP}\/writedata`, {StationId: deviceData.DeviceId, Data: {['2261']: 'False'}}, false)
              message.success('设置数据成功！')
            }}>下载</Button>
            <Button variant={'outlined'} color={'primary'} icon={<CloudUploadOutlined />} onClick={async () => {
              await eapRequest(`http\:\/\/${EAP_IP}\/writedata`, {StationId: deviceData.DeviceId, Data: {['2262']: 'True'}}, false)
              await eapRequest(`http\:\/\/${EAP_IP}\/writedata`, {StationId: deviceData.DeviceId, Data: {['2262']: 'False'}}, false)
              message.success('设置数据成功！')
            }}>上传</Button>
          </div>
        )
      },
      {
        span: 6, formItem: (
          <div className={styles['rms-btn-group']}>
            <Button variant={'outlined'} color={'primary'} icon={<SyncOutlined />} onClick={() => handleGetValue(false)}>刷新</Button>
            <Button variant={'outlined'} color={'primary'} icon={<CloudDownloadOutlined />} onClick={handleExport}>导出配方文件</Button>
          </div>
        )
      }
    ]] :
    [[
      {span: 6, label: '设备名称', name: 'DeviceName', formItem: (<Input disabled />)},
      {span: 6, label: '配方模板', name: 'TemplateName', formItem: (<Input disabled />)},
      {
        span: 12, formItem: (
          <div className={styles['rms-btn-group']}>
            <Button variant={'outlined'} color={'primary'} icon={<SyncOutlined />} onClick={() => handleGetValue(false)}>刷新</Button>
            <Button variant={'outlined'} color={'primary'} icon={<CloudDownloadOutlined />} onClick={handleExport}>导出配方文件</Button>
          </div>
        )
      }
    ]]
  const handleValueClick = (text, pointLocation) => {
    setOpen(true)
    setClickPointLocation(pointLocation)
    modalForm.setFieldsValue({nowValue: text, setValue: ''})
  }
  const handleSetValue = async () => {
    const {DeviceId: StationId} = deviceData
    const [tableIndex, rowIndex, columnIndex] = clickPointLocation
    const pointId = data[tableIndex][rowIndex][columnIndex]
    const setValue = modalForm.getFieldValue('setValue')
    await eapRequest(`http\:\/\/${EAP_IP}\/writedata`, {StationId, Data: {[pointId]: setValue}}, false)
    message.success('设置实时数据成功！')
    setOpen(false)
    setTimeout(() => handleGetValue(false), 1000)
  }
  const items = useMemo(() => {
    return tableName.map((item, tableIndex) => {
      const myColumns = columns[tableIndex].filter(i => i !== '').map((column, columnIndex) => {
        return {
          title: column,
          dataIndex: columnIndex + 1,
          render: (text, record, rowIndex) => {
            const curTablePointLocation = Object.values(pointList[tableIndex] ?? []).map((point) => point.join())
            const cellPointLocation = [rowIndex, columnIndex].join()
            return curTablePointLocation.includes(cellPointLocation) ? (
              <Button
                size={'small'}
                variant={'link'}
                color={'primary'}
                onClick={() => handleValueClick(text, [tableIndex, rowIndex, columnIndex])}
              >{text}</Button>
            ) : text
          }
        }
      })
      return {
        label: item[0],
        key: String(tableIndex + 1),
        children: (
          <Table
            loading={tbLoad}
            rowKey={'0'}
            scroll={{x: 'max-content', y: 400, ...scroll}}
            size={'small'}
            pagination={false}
            columns={myColumns}
            dataSource={valueData[tableIndex]?.map((row, rowIndex) => [rowIndex, ...row]) ?? []}
          />
        )
      }
    })
  }, [valueData, tbLoad])
  useEffect(() => {
    if (pointList.length) {
      handleGetValue(false)
    }
  }, [activeKey, pointList])
  useEffect(() => {
    // 相当于进入页面时
    const {DeviceName, TemplateName} = deviceData
    form.setFieldsValue({
      DeviceName,
      TemplateName,
      RecipeEdit: ''
    })
    setActiveKey('1')
    handleSetPointList()
  }, [fileData]);
  return (
    <>
      <CustomForm
        form={form}
        formItems={formItems}
      />
      <Tabs
        activeKey={activeKey}
        items={items}
        onChange={(key) => setActiveKey(key)}
      >
      </Tabs>
      <Modal
        open={open}
        onOk={() => handleSetValue()}
        onCancel={() => setOpen(false)}
        width={300}
        title={'参数修改'}>
        <CustomForm
          form={modalForm}
          formItems={[
            [{span: 24, label: '参数实际值', name: 'nowValue', formItem: <Input disabled />}],
            [{span: 24, label: '参数设定值', name: 'setValue', formItem: <Input />}],
          ]}
        ></CustomForm>
      </Modal>
    </>
  )
}
export default SOP
