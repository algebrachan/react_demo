import {Button, Form, Input, Popconfirm, Select, Table, message, Radio, Popover} from 'antd'
import {isTrue, deviceApplyType} from '../../dict.js'
import {useEffect, useState} from 'react'
import {getDeviceApply, addDeviceApply, updateDeviceApply, deleteDeviceApply,} from '@/apis/qms_router.jsx'
import ModalForm from './ModalForm.jsx'
import {DownloadOutlined} from '@ant-design/icons'
import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {deviceApplyApprove} from '../../../../../../apis/qms_router.jsx'
import DistributionModal from './DistributionModal.jsx'

const Apply4Use = () => {
  const [form] = Form.useForm()
  const [approveForm] = Form.useForm()
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isEdit, setIsEdit] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [distributionModalOpen, setDistributionModalOpen] = useState(false)
  const [curRowData, setCurRowData] = useState({})
  const defaultQueryFormData = {
    theme: '',
    application_type: '',
    equipment_name: '',
    material_number: '',
    equipment_model: '',
  }
  const pagination = () => {
    return {
      position: ["bottomCenter"],
      total,
      showTotal: (total) => `共 ${total} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSize,
      current: pageNo,
      onChange: (page, size) => {
        setPageSize(size);
        setPageNo(page);
      },
    };
  };
  const handleApprove = (row) => {
    approveForm.validateFields()
    .then(values => {
      deviceApplyApprove({id: row.id, ...values}, ({data}) => {
        approveForm.resetFields()
        getTableData()
        handleRowOpen(row, false)
        message.success('操作成功')
      })
    })
  }
  const handleRowOpen = (record, open) => {
    setTbData(prev => {
      return prev.map(item => {
        if (item.id === record.id) {
          item.open = open
        }
        return {...item}
      })
    })
  };
  const generateColumns = () => {
    return [
      {
        title: '主题',
        dataIndex: 'theme',
        fixed: 'left'
      },
      {
        title: '申请人',
        dataIndex: 'applicant',
        fixed: 'left'
      },
      {
        title: '申请部门',
        dataIndex: 'department'
      },
      {
        title: '申请类型',
        dataIndex: 'application_type'
      },
      {
        title: '设备名称',
        dataIndex: 'equipment_name'
      },
      {
        title: '物料号',
        dataIndex: 'material_number'
      },
      {
        title: '设备型号',
        dataIndex: 'equipment_model'
      },
      {
        title: '设备量程',
        dataIndex: 'equipment_range'
      },
      {
        title: '设备精度',
        dataIndex: 'equipment_accuracy'
      },
      {
        title: '单位',
        dataIndex: 'unit'
      },
      {
        title: '数量',
        dataIndex: 'quantity'
      },
      {
        title: '申请原因',
        dataIndex: 'reason'
      },
      {
        title: '状态',
        dataIndex: 'status'
      },
      {
        title: '操作',
        fixed: 'right',
        render: (_, record) => {
          return (
            <>
              <Popover
                style={{width: 350}}
                trigger="click"
                title={'申请审批'}
                open={record.open}
                onOpenChange={(open) => handleRowOpen(record, open)}
                content={
                  <CustomForm
                    style={{width: 250}}
                    form={approveForm}
                    formItems={
                      [
                        [{
                          span: 24,
                          label: '是否通过',
                          name: 'status',
                          rules: [{required: true, message: '请选择是否通过'}],
                          formItem: <Radio.Group options={[{label: '通过', value: '通过'}, {label: '不通过', value: '不通过'}]} />
                        }],
                        [{
                          span: 24,
                          label: '审批意见',
                          name: 'reason',
                          rules: [{required: true, message: '请输入审批意见'}],
                          formItem: <Input.TextArea />
                        }],
                        [{
                          span: 24,
                          formItem: <Button size="small" style={{width: 'auto', float: 'right'}} type="primary" onClick={() => handleApprove(record)}>确认</Button>
                        }]
                      ]
                    }>
                  </CustomForm>
                }>
                <Button type="text" disabled={record.status === '通过' || record.status === '已发放'}>审批</Button>
              </Popover>
              <Button type="text" disabled={record.status !== '通过'} onClick={() => {
                setDistributionModalOpen(true)
                setCurRowData({...record})
              }}>设备发放</Button>
              <Button type="text" disabled={record.status && record.status !== '不通过'} onClick={() => {
                setIsEdit(true)
                setModalVisible(true)
                setCurRowData({...record})
              }}>编辑</Button>
              <Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => deleteRow(record)}>
                <Button type="text" disabled={record.status && record.status !== '不通过'}>删除</Button>
              </Popconfirm>
            </>
          )
        }
      }
    ]
  };
  const deleteRow = (record) => {
    deleteDeviceApply({id: record.id}, () => {
      message.success("删除成功")
      getTableData()
    })
  };
  const handleAddRow = () => {
    setIsEdit(false)
    setModalVisible(true)
  };
  const getTableData = () => {
    const formData = form.getFieldsValue();
    setTbLoad(true)
    getDeviceApply({...formData, page: pageNo, limit: pageSize},
      ({data: {data, length}}) => {
        if (length > 0) setTbData(data.map((item => ({...item, key: item.id, open: false}))))
        setTbLoad(false)
        setTotal(length)
      },
      () => {
        setTbLoad(false)
      })
  };
  const formItems = [
    [
      {span: 3, label: '主题', name: 'theme', formItem: <Input />},
      {span: 3, label: '申请类型', name: 'application_type', formItem: <Select options={deviceApplyType} />},
      {span: 3, label: '设备名称', name: 'equipment_name', formItem: <Input />},
      {span: 3, label: '物料号', name: 'material_number', formItem: <Input />},
      {span: 3, label: '设备型号', name: 'equipment_model', formItem: <Input />},
      {
        span: 4, formItem: (
          <>
            <Button style={{width: 'auto', marginRight: 8}} onClick={() => form.resetFields()}>重置</Button>
            <Button style={{width: 'auto'}} type="primary" onClick={getTableData}>查询</Button>
          </>
        )
      },
      {
        span: 5, formItem: <Button style={{width: 'auto', float: 'right'}} type="primary" onClick={handleAddRow}>新建</Button>
      }
    ]
  ]
  useEffect(() => {
    getTableData()
  }, [pageNo, pageSize]);
  return (
    <>
      <CustomForm
        form={form}
        style={{marginBottom: 8}}
        initialValues={defaultQueryFormData}
        formItems={formItems}
      />
      <Table
        loading={tb_load}
        size="small"
        columns={generateColumns()}
        dataSource={tb_data}
        bordered
        scroll={{x: "max-content",}}
        pagination={pagination()}
      />
      <ModalForm
        row={curRowData}
        refresh={getTableData}
        isEdit={isEdit}
        visible={modalVisible}
        setVisible={setModalVisible}
      />
      <DistributionModal
        open={distributionModalOpen}
        setOpen={setDistributionModalOpen}
        refresh={getTableData}
        row={curRowData}
      ></DistributionModal>
    </>
  )
}
export default Apply4Use
