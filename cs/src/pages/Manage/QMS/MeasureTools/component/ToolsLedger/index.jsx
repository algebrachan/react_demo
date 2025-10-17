import {Button, Form, Input, Popconfirm, Select, Table, message} from 'antd'
import {calibrationType, isTrue, measureTypes as typeOptions} from '../../dict.js'
import {useEffect, useState} from 'react'
import {addToolsLedger, editToolsLedger, getToolsLedger, deleteToolsLedger, downloadLedgerReport, addVerificationPlan, addMaintenancePlan} from '@/apis/qms_router.jsx'
import ModalForm from './ModalForm.jsx'
import {DownloadOutlined} from '@ant-design/icons'
import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'

const ToolsLedger = () => {
  const [form] = Form.useForm()
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [total, setTotal] = useState(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isEdit, setIsEdit] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [curRowData, setCurRowData] = useState({})
  const [checkedRows, setCheckedRows] = useState([])
  const defaultQueryFormData = {
    measuring_tool_name: '',
    management_number: '',
    measuring_tools_types: '',
    user_department: '',
    reminder_level_one: '',
    use_status: []
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
  const handleDownload = (row) => {
    const {calibration_report, calibration_report_path} = row
    downloadLedgerReport({path: calibration_report_path}, ({data, headers}) => {
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = 'none'
      link.href = url;
      link.download = calibration_report;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    })
  }
  const generateColumns = () => {
    return [
      {
        title: '量具名称',
        dataIndex: 'measuring_tool_name',
        fixed: 'left'
      },
      {
        title: '管理编号',
        dataIndex: 'management_number',
        fixed: 'left'
      },
      {
        title: '物料号',
        dataIndex: 'material_number',
      },
      {
        title: '型号',
        dataIndex: 'model'
      },
      {
        title: '量程',
        dataIndex: 'measurement_span'
      },
      {
        title: '精度',
        dataIndex: 'accuracy'
      },
      {
        title: '领用部门',
        dataIndex: 'user_department'
      },
      {
        title: '使用区域',
        dataIndex: 'user_zones'
      },
      {
        title: '计量管理员',
        dataIndex: 'metrology_administrator'
      },
      {
        title: '使用人',
        dataIndex: 'user'
      },
      {
        title: '计量类别',
        dataIndex: 'measurement_category'
      },
      {
        title: '量具种类',
        dataIndex: 'measuring_tools_types'
      },
      {
        title: '校准周期（月）',
        dataIndex: 'calibration_cycle'
      },
      {
        title: '校准日期',
        dataIndex: 'calibration_date'
      },
      // {
      //   title: '保养周期（月）',
      //   dataIndex: 'maintenance_cycle'
      // },
      // {
      //   title: '保养日期',
      //   dataIndex: 'maintenance_date'
      // },
      {
        title: '有效日期',
        dataIndex: 'effective_date'
      },
      {
        title: '使用状态',
        dataIndex: 'use_status',
        render: (text) => (typeOptions.filter(item => item.value == text)[0]?.label)
      },
      {
        title: '购入日期',
        dataIndex: 'purchase_date'
      },
      {
        title: '制造商',
        dataIndex: 'manufacturer'
      },
      {
        title: '出厂编号',
        dataIndex: 'factory_number'
      },
      {
        title: '校验类型',
        dataIndex: 'inspection_type',
        render: (text) => (calibrationType.filter(item => item.value === text)[0]?.label)
      },
      {
        title: '是否强制检验',
        dataIndex: 'mandatory_inspection',
        render: (text) => (isTrue.filter(item => item.value === text)[0]?.label)
      },
      {
        title: '管理人/一级提醒人',
        dataIndex: 'reminder_level_one'
      },
      {
        title: '二级提醒人',
        dataIndex: 'reminder_level_tow'
      },
      {
        title: '三级提醒人',
        dataIndex: 'reminder_level_three'
      },
      // {
      //   title: '保质期',
      //   dataIndex: 'quality_guarantee_period'
      // },
      {
        title: '校准机构',
        dataIndex: 'calibration_agency'
      },
      {
        title: '校准报告',
        dataIndex: 'calibration_report',
        render: (text, record) => (
          text && <Button onClick={() => handleDownload(record)} size="small" icon={<DownloadOutlined />}>{text}</Button>
        )
      },
      // {
      //   title: '是否显示',
      //   dataIndex: 'is_displayed',
      //   render: (text) => (isTrue.filter(item => item.value === text)[0]?.label)
      // },
      // {
      //   title: '是否单一仪器',
      //   dataIndex: 'is_single_instrument',
      //   render: (text) => (isTrue.filter(item => item.value === text)[0]?.label)
      // },
      {
        title: '执行项目',
        dataIndex: 'execute_project'
      },
      {
        title: '备注',
        dataIndex: 'notes'
      },
      {
        title: '操作',
        fixed: 'right',
        render: (_, record) => {
          return (
            <>
              <Button type="text" onClick={() => {
                setIsEdit(true)
                setModalVisible(true)
                setCurRowData({...record})
              }}>编辑</Button>
              <Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => deleteRow(record)}>
                <Button type="text">删除</Button>
              </Popconfirm>
            </>
          )
        }
      }
    ]
  };
  const deleteRow = (record) => {
    deleteToolsLedger({id: record.id}, () => {
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
    getToolsLedger({...formData, page: pageNo, limit: pageSize},
      ({data: {data, length}}) => {
        setTbLoad(false)
        setTbData(data.map((item => ({...item, key: item.id}))))
        setTotal(length)
      },
      () => {
        setTbLoad(false)
      })
  };
  const handleAddMaintenancePlan = () => {
    const [checkedRow] = checkedRows
    const {
      id,
      quality_guarantee_period,
      metrology_administrator,
      reminder_level_tow,
      reminder_level_three,
      effective_date,
      maintenance_date,
      user,
      maintenance_cycle,
    } = checkedRow
    addMaintenancePlan({
      equipment_ledger_id: id,
      quality_guarantee_period,
      metrology_administrator,
      reminder_level_tow,
      reminder_level_three,
      effective_date,
      maintenance_date,
      user,
      maintenance_cycle,
    }, ({data}) => {
      message.success("保养计划添加成功")
    })
  };
  const handleAddVerificationPlan = () => {
    const [checkedRow] = checkedRows
    const {
      id,
      quality_guarantee_period,
      metrology_administrator,
      reminder_level_tow,
      reminder_level_three,
      effective_date,
      calibration_date,
      user,
      calibration_cycle,
      calibration_agency
    } = checkedRow
    addVerificationPlan({
      equipment_ledger_id: id,
      quality_guarantee_period,
      metrology_administrator,
      reminder_level_tow,
      reminder_level_three,
      effective_date,
      calibration_date,
      user,
      calibration_cycle,
      calibration_agency
    }, ({data}) => {
      message.success("校准计划添加成功")
    })
  }
  const formItems = [
    [
      {span: 3, label: '量具名称', name: 'measuring_tool_name', formItem: <Input />},
      {span: 3, label: '管理编号', name: 'management_number', formItem: <Input />},
      {span: 3, label: '领用部门', name: 'user_department', formItem: <Input />},
      {span: 3, label: '管理人/一级提醒人', name: 'reminder_level_one', formItem: <Input />},
      {span: 2, label: '量具种类', name: 'measuring_tools_types', formItem: <Input />},
      {span: 3, label: '使用状态', name: 'use_status', formItem: <Select mode="multiple" maxTagCount={1} options={typeOptions} />},
      {
        span: 2, formItem: (
          <>
            <Button style={{width: 'auto', marginRight: 8}} onClick={() => form.resetFields()}>重置</Button>
            <Button style={{width: 'auto'}} type="primary" onClick={getTableData}>查询</Button>
          </>
        )
      },
      {
        span: 5, formItem: (
          <>
            <Button style={{width: 'auto', float: 'right'}} type="primary" onClick={handleAddRow}>新建</Button>
            <Button disabled={checkedRows.length !== 1} style={{width: 'auto', float: 'right', marginRight: 8}} onClick={handleAddMaintenancePlan}>增加保养计划</Button>
            <Button disabled={checkedRows.length !== 1} style={{width: 'auto', float: 'right', marginRight: 8}} onClick={handleAddVerificationPlan}>增加校准计划</Button>
          </>
        )
      }
    ]
  ]
  const rowSelection = {
    onChange: (keys, rows) => setCheckedRows(rows)
  }
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
        rowSelection={rowSelection}
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
    </>
  )
}
export default ToolsLedger
