import Title from "@/pages/Manage/RMS/component/Title.jsx";
import {Button, message, Popconfirm, Table} from 'antd'
import {DeleteOutlined, DownloadOutlined, ExportOutlined, FormOutlined, ImportOutlined, PlusSquareOutlined, SyncOutlined, UploadOutlined} from '@ant-design/icons'
import styles from '../../style/index.module.less'
import React, {useState, useRef, useEffect} from "react";
import ModalForm from './ModalForm.jsx'
import {deleteDevice, deleteDeviceType, getAreas, readDevice, readDeviceGroup, readDeviceType} from '@/apis/rms.js'

const EnableDict = [{value: true, label: '启用'}, {value: false, label: '禁用'}]
const DeviceLedger = ({deviceGroupList, deviceTypeList, areaList, deviceList, getDeviceList}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [tbData, setTbData] = useState([])
  const [tbLoading, setTbLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [curRowData, setCurRowData] = useState({})
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const genColumns = () => {
    return [
      {title: '序号', dataIndex: 'Index', width: 100},
      {title: '设备名称', dataIndex: 'DisplayName', width: 200},
      {title: '设备类型', dataIndex: 'DeviceTypeId', width: 200, render: (text) => deviceTypeList.find(item => item.Id === text)?.DisplayName ?? ''},
      {
        title: '设备分组', dataIndex: 'DeviceGroupId', width: 200, render: (text, {DeviceGroupId, DeviceTypeId}) => {
          return deviceGroupList.find(item => item.Id === `${DeviceTypeId}-${DeviceGroupId}`)?.DisplayName ?? ''
        }
      },
      {title: 'IP地址', dataIndex: 'IpAddress', width: 200},
      {title: '区域名称', dataIndex: 'AreaId', width: 200, render: (text) => areaList.find(item => item.AreaId === text)?.DisplayName ?? ''},
      {title: '状态', dataIndex: 'IsEnable', width: 200, render: (text) => EnableDict.find(item => item.value === text)?.label ?? ''},
      {title: '备注', dataIndex: 'Description'},
    ]
  };
  const handleRowClick = (record) => {
    setSelectedRowKeys([record.DeviceId])
    setCurRowData({...record})
  };
  const getTbData = () => {
    setTbLoading(true)
    setTimeout(() => {
      setTbLoading(false)
      setTbData(deviceList)
      setSelectedRowKeys([])
    }, 300)
  };
  const handleAddRow = () => {
    setIsEdit(false)
    setOpen(true)
  };
  const handleEditRow = () => {
    setIsEdit(true)
    setOpen(true)
  }
  const handleDeleteRow = () => {
    deleteDevice(curRowData.DeviceId)
    .then(res => {
      message.success('删除成功')
      getDeviceList()
    })
  };
  useEffect(() => {
    getTbData()
  }, [deviceList]);
  return (
    <>
      <Title
        border={false}
        title={'设备台账'}
        style={{height: `calc(100% - 16)`}}
        margin={`0 0 16`}
        right={(
          <div className={styles['button-group']}>
            <Button variant={'outlined'} style={{marginRight: 8}} color={'primary'} size={'small'} icon={<SyncOutlined />} onClick={getDeviceList}>刷新</Button>
            <Button variant={'outlined'} style={{marginRight: 8}} color={'primary'} size={'small'} icon={<PlusSquareOutlined />} onClick={handleAddRow}>新增</Button>
            <Button
              variant={'outlined'}
              style={{marginRight: 8}}
              color={'primary'}
              size={'small'}
              icon={<FormOutlined />}
              onClick={handleEditRow}
              disabled={!selectedRowKeys.length}
            >编辑</Button>
            <Popconfirm
              title="警告"
              description="是否删除该条数据？"
              onConfirm={handleDeleteRow}
              okText="确认"
              cancelText="取消">
              <Button variant={'outlined'} color={'primary'} size={'small'} icon={<DeleteOutlined />} disabled={!selectedRowKeys.length}>删除</Button>
            </Popconfirm>
          </div>
        )}
      >
        <Table
          loading={tbLoading}
          rowKey={'DeviceId'}
          size={'small'}
          columns={genColumns()}
          scroll={{
            x: 'max-content',
            y: `calc(100vh - 246)`
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onSelect: (record) => {
              setSelectedRowKeys([record.DeviceId])
              setCurRowData({...record})
            },
          }}
          dataSource={tbData}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
          pagination={false}
        ></Table>
      </Title>
      <ModalForm
        deviceTypeList={deviceTypeList}
        deviceGroupList={deviceGroupList}
        areaList={areaList}
        EnableDict={EnableDict}
        isEdit={isEdit}
        open={open}
        refresh={getDeviceList}
        setOpen={setOpen}
        row={curRowData} />
    </>
  );
};
export default DeviceLedger;
