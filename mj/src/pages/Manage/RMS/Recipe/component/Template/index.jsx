import Title from "@/pages/Manage/RMS/component/Title.jsx";
import {Button, Form, message, Popconfirm, Select, Table} from 'antd'
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExportOutlined,
  FormOutlined,
  ImportOutlined,
  PlusSquareOutlined,
  SyncOutlined,
  UploadOutlined
} from '@ant-design/icons'
import styles from '../../style/index.module.less'
import React, {useState, useRef, useEffect} from "react";
import ModalForm from '@/pages/Manage/RMS/Recipe/component/Template/ModalForm.jsx'
import {deleteDeviceType, deleteRecipeTemplate, exportRecipeTemplateFile, readDeviceType, readRecipeTemplate} from '@/apis/rms.js'
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";

const RecipeTemplate = ({deviceTypeList, recipeTemplateList, getRecipeTemplateList, queryDeviceTypeIds}) => {
  const [isEdit, setIsEdit] = useState(false)
  const [tbData, setTbData] = useState([])
  const [tbLoading, setTbLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [curRowData, setCurRowData] = useState({})
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [form] = Form.useForm()
  const handleAddRow = () => {
    setIsEdit(false)
    setOpen(true)
  };
  const handleEditRow = () => {
    setIsEdit(true)
    setOpen(true)
  }
  const handleDeleteRow = () => {
    deleteRecipeTemplate(curRowData.TemplateId)
    .then(res => {
      message.success('删除成功')
      getRecipeTemplateList()
    })
  };
  const getTbData = () => {
    setTbLoading(true)
    setTimeout(() => {
      setTbLoading(false)
      setTbData(recipeTemplateList.filter(({DeviceTypeId}) => queryDeviceTypeIds.length === 0 || queryDeviceTypeIds.includes(DeviceTypeId)))
      setSelectedRowKeys([])
    }, 300)
  };
  const convertBase642Blob = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Blob([bytes]);
  }
  const handleExport = () => {
    const {TemplateId, TemplateFileName} = curRowData
    exportRecipeTemplateFile(TemplateId)
    .then(({Data}) => {
      if (Data) {
        const blob = convertBase642Blob(Data);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = TemplateFileName
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } else {
        message.error('模板文件不存在，导出失败！')
      }
    })
  };
  const formItems = [[
    {
      span: 24,
      formItem: (
        <div className={styles['rms-btn-group']}>
          <Button variant={'outlined'} color={'primary'} size={'small'} icon={<SyncOutlined />} onClick={getTbData}>刷新</Button>
          <Button variant={'outlined'} color={'primary'} size={'small'} icon={<PlusSquareOutlined />} onClick={handleAddRow}>新增</Button>
          <Button variant={'outlined'} color={'primary'} size={'small'} icon={<FormOutlined />} onClick={handleEditRow} disabled={!selectedRowKeys.length}>编辑</Button>
          <Popconfirm title="警告" description="是否删除该条数据？" onConfirm={handleDeleteRow} okText="确认" cancelText="取消">
            <Button variant={'outlined'} color={'primary'} size={'small'} icon={<DeleteOutlined />} disabled={!selectedRowKeys.length}>删除</Button>
          </Popconfirm>
          <Button
            variant={'outlined'}
            color={'primary'}
            size={'small'}
            icon={<CloudDownloadOutlined />}
            disabled={!selectedRowKeys.length}
            onClick={() => handleExport()}
          >导出模版文件</Button>
        </div>
      )
    },
  ]]
  const genColumns = () => {
    return [
      {title: '模板名称', dataIndex: 'TemplateName', width: 400},
      {title: '模板文件名称', dataIndex: 'TemplateFileName', width: 400},
      {title: '备注', dataIndex: 'Description'},
    ]
  };
  const handleRowClick = (record) => {
    setSelectedRowKeys([record.TemplateId])
    setCurRowData({...record})
  };
  useEffect(() => {
    getTbData()
  }, [recipeTemplateList, queryDeviceTypeIds]);
  return (
    <>
      <Title
        className={styles['rms-recipe-template']}
        border={false}
        title={'配方模板'}
        style={{height: `calc(100% - 16)`}}
        margin={`0 0 16`}>
        <CustomForm form={form} formItems={formItems}></CustomForm>
        <Table
          loading={tbLoading}
          rowKey={'TemplateId'}
          size={'small'}
          columns={genColumns()}
          scroll={{
            x: 'max-content',
            y: `calc(100vh - 342)`
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onSelect: (record) => {
              setSelectedRowKeys([record.TemplateId])
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
      <ModalForm isEdit={isEdit} open={open} refresh={getRecipeTemplateList} setOpen={setOpen} row={curRowData} deviceTypeList={deviceTypeList}></ModalForm>
    </>
  );
};
export default RecipeTemplate;
