import {Button, Form, Input, Popconfirm, Select, Table, message, DatePicker} from 'antd'
import {isTrue, measureTypes as typeOptions, calibrationStatus, maintenanceStatus, maintenanceResult} from '../../dict.js'
import {useEffect, useState} from 'react'
import {
  downloadLedgerReport,
  getMaintenancePlan,
  deleteMaintenancePlan,
  editMaintenancePlan,
  downloadMaintenancePlan, finishVerificationPlan, finishMaintenancePlan
} from '@/apis/qms_router.jsx'
import ModalForm from './ModalForm.jsx'
import {DownloadOutlined} from '@ant-design/icons'
import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import dayjs from 'dayjs'

const MaintenancePlan = () => {
  const [form] = Form.useForm()
  const [popForm] = Form.useForm()
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
    user_zones: '',
    user_department: '',
    maintenance_status: [],
    maintenance_results: [],
    metrology_administrator: '',
    user: '',
    measurement_span: '',
    maintenance_date: [],
    effective_date: []
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
    const {maintenance_report, maintenance_report_path} = row
    downloadLedgerReport({path: maintenance_report_path}, ({data, headers}) => {
      const blob = new Blob([data], {type: headers.get('content-type')});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = 'none'
      link.href = url;
      link.download = maintenance_report;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    })
  }
  const generateColumns = () => {
    return [
      {
        title: '保养名称',
        dataIndex: 'maintenance_name',
        fixed: 'left'
      },
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
        title: '领用部门',
        dataIndex: 'user_department'
      },
      {
        title: '使用区域',
        dataIndex: 'user_zones'
      },
      {
        title: '保质期',
        dataIndex: 'quality_guarantee_period'
      },
      {
        title: '保养状态',
        dataIndex: 'maintenance_status',
        render: (text) => (maintenanceStatus.filter(item => item.value === text)[0]?.label)
      },
      {
        title: '预警标识',
        dataIndex: 'warning_signs'
      },
      {
        title: '计量管理员',
        dataIndex: 'metrology_administrator'
      },
      {
        title: '二级提醒人',
        dataIndex: 'reminder_level_tow'
      },
      {
        title: '三级提醒人',
        dataIndex: 'reminder_level_three'
      },
      {
        title: '有效日期',
        dataIndex: 'effective_date'
      },
      {
        title: '保养日期',
        dataIndex: 'maintenance_date'
      },
      {
        title: '审批时间',
        dataIndex: 'approval_time'
      },
      {
        title: '使用人',
        dataIndex: 'user'
      },
      {
        title: '保养周期（月）',
        dataIndex: 'maintenance_cycle'
      },
      {
        title: '保养结果',
        dataIndex: 'maintenance_results',
        render: (text) => (maintenanceResult.filter(item => item.value === text)[0]?.label)
      },
      {
        title: '保养结果说明',
        dataIndex: 'maintenance_results_notes'
      },
      {
        title: '保养报告',
        dataIndex: 'maintenance_report',
        render: (text, record) => (
          text && <Button onClick={() => handleDownload(record)} size="small" icon={<DownloadOutlined />}>{text}</Button>
        )
      },
      {
        title: '保养人',
        dataIndex: 'inspection_submitter'
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
    deleteMaintenancePlan({id: record.id}, () => {
      message.success("删除成功")
      getTableData()
    })
  };
  const getTableData = () => {
    const formData = form.getFieldsValue();
    setTbLoad(true)
    getMaintenancePlan({...formData, page: pageNo, limit: pageSize},
      ({data: {data, length}}) => {
        setTbLoad(false)
        setTbData(data.map((item => ({...item, key: item.id}))))
        setTotal(length)
      },
      () => {
        setTbLoad(false)
      })
  };
  const handleRowStatus = (status) => {
    const [{id}] = checkedRows
    editMaintenancePlan({id, maintenance_status: status}, () => {
      getTableData()
    })
  }
  const handleRowFinish = (status) => {
    const [{id}] = checkedRows
    return popForm.validateFields()
    .then(res => {
      finishMaintenancePlan({id, maintenance_status: status, ...res}, () => {
        getTableData()
      })
    })
  }
  const handleExportExcel = () => {
    const formData = form.getFieldsValue();
    downloadMaintenancePlan(formData, ({data}) => {
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = 'none'
      link.href = url;
      link.download = '数据详情.csv';
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    })
  }
  const formItems = [
    [
      {span: 3, label: '保养名称', name: 'maintenance_name', formItem: <Input />},
      {span: 3, label: '管理编号', name: 'management_number', formItem: <Input />},
      {span: 2, label: '量具名称', name: 'measuring_tool_name', formItem: <Input />},
      {span: 2, label: '使用区域', name: 'user_zones', formItem: <Input />},
      {span: 3, label: '使用部门', name: 'user_department', formItem: <Input />},
      {span: 4, label: '保养状态', name: 'maintenance_status', formItem: <Select mode="multiple" maxTagCount={1} options={maintenanceStatus} />},
      {span: 4, label: '保养结果', name: 'maintenance_results', formItem: <Select mode="multiple" maxTagCount={1} options={maintenanceResult} />},
      {span: 3, label: '计量管理员', name: 'metrology_administrator', formItem: <Input />},
    ],
    [
      {span: 3, label: '使用人', name: 'user', formItem: <Input />},
      {span: 3, label: '测量范围', name: 'measurement_span', formItem: <Input />},
      {
        span: 6,
        label: '保养时间',
        name: 'maintenance_date',
        getValueProps: value => ({value: value && value.map(i => dayjs(i))}),
        normalize: value => value && value.map(i => `${dayjs(i).format('YYYY-MM-DD')}`),
        formItem: <DatePicker.RangePicker />
      },
      {
        span: 6,
        label: '有效时间',
        name: 'effective_date',
        getValueProps: value => ({value: value && value.map(i => dayjs(i))}),
        normalize: value => value && value.map(i => `${dayjs(i).format('YYYY-MM-DD')}`),
        formItem: <DatePicker.RangePicker />
      },
      {
        span: 2, formItem: (
          <>
            <Button style={{width: 'auto', marginRight: 8}} onClick={() => form.resetFields()}>重置</Button>
            <Button style={{width: 'auto'}} type="primary" onClick={getTableData}>查询</Button>
          </>
        )
      },
    ],
    [
      {
        span: 24, formItem: (
          <>
            <Button style={{width: 'auto', float: 'right'}} onClick={() => handleExportExcel()}>导出Excel</Button>
            <Popconfirm
              onConfirm={() => handleRowFinish(2)}
              icon={null}
              title={null}
              description={(
                <Form size="medium" layout="vertical" form={popForm}>
                  <Form.Item
                    label="下次保养日期"
                    getValueProps={value => value => ({value: value && dayjs(value)})}
                    normalize={value => value && `${dayjs(value).format('YYYY-MM-DD')}`}
                    name="maintenance_date"
                    rules={[{required: true, message: ''}]}>
                    <DatePicker />
                  </Form.Item>
                </Form>
              )}
            >
              <Button disabled={checkedRows.length !== 1} style={{width: 'auto', float: 'right', marginRight: 8}}>保养完成</Button>
            </Popconfirm>
            <Button disabled={checkedRows.length !== 1} style={{width: 'auto', float: 'right', marginRight: 8}} onClick={() => handleRowStatus(0)}>取消保养</Button>
            <Button disabled={checkedRows.length !== 1} style={{width: 'auto', float: 'right', marginRight: 8}} onClick={() => handleRowStatus(1)}>保养</Button>
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
export default MaintenancePlan
