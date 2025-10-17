import styles from '@/pages/Manage/QMS/AuditManagement/SystemAudit/style/index.module.less'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {Button, DatePicker, Form, message, Popconfirm, Select, Table, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {del_product_audit_report, read_product_audit_report} from '@/apis/qms_router.jsx'
import {SearchOutlined, UploadOutlined} from '@ant-design/icons'
import ModalForm from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionReport/ModalForm.jsx'
import {DefectCoefficient} from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionStandard/ModalForm.jsx'

export const ReviewDecision = [
  {label: '放行', value: '放行'},
  {label: '扣压', value: '扣压'}
]
export const IsWhether = [
  {label: '是', value: '是'},
  {label: '否', value: '否'}
]
const InspectionReport = ({planInfo, year, setYear}) => {
  const [form] = Form.useForm()
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [curData, setCurData] = useState({})
  const handleAddRow = () => {
    setOpen(true)
    setIsEdit(false)
  }
  const handleDeleteRow = (row) => {
    del_product_audit_report(
      {id: row.id},
      () => {
        message.success(`删除成功`)
        getTableData()
      })
  }
  const defaultQueryFormData = {year: String(new Date().getFullYear())}
  const [cachedQueryFormData, setCachedQueryFormData] = useState(defaultQueryFormData)
  const listColumns = () => [
    {
      title: '产品名称',
      dataIndex: 'product_name',
      width: 120
    },
    {
      title: '产品编号',
      dataIndex: 'product_number',
      width: 120
    },
    {
      title: '生产日期',
      dataIndex: 'manufacture_date',
      width: 120
    },
    {
      title: '顾客名称',
      dataIndex: 'customer_name',
      width: 120
    },
    {
      title: '取样时间',
      dataIndex: 'sample_time',
      width: 120
    },
    {
      title: '取样地点',
      dataIndex: 'sampling_location',
      width: 120
    },
    {
      title: 'QKZ',
      dataIndex: 'inspection_basis',
      width: 120
    },
    {
      title: 'A类缺陷',
      dataIndex: 'A_class_defect',
      width: 120
    },
    {
      title: 'B类缺陷',
      dataIndex: 'B_class_defect',
      width: 120
    },
    {
      title: 'C类缺陷',
      dataIndex: 'C_class_defect',
      width: 120
    },
    {
      title: '审核决定',
      dataIndex: 'review_decision',
      width: 120,
      render: (text) => {
        return DefectCoefficient.find(({value}) => value === text)?.label
      }
    },
    {
      title: '操作',
      fixed: 'right',
      width: 120,
      render: (_, record) => {
        return (
          <>
            <Button variant="text" color={'primary'} onClick={() => {
              setIsEdit(true)
              setOpen(true)
              setCurData({...record})
            }}>编辑</Button>
            {/*<Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => handleDeleteRow(record)}>
             <Button variant="text" color={'danger'}>删除</Button>
             </Popconfirm>*/}
          </>
        )
      }
    }
  ]
  const getTableData = (formData = cachedQueryFormData) => {
    setTbLoad(true)
    read_product_audit_report(
      formData,
      ({data: {data}}) => {
        setTbData(data)
        setTbLoad(false)
      },
      (err) => {
        setTbData([])
        setTbLoad(false)
      }
    )
  }
  const formItems = [
    [
      {
        span: 4,
        label: '年份',
        name: 'year',
        rules: [{required: true, message: ''}],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY'),
        formItem: <DatePicker picker="year" />
      },
      {
        span: 4, formItem: (
          <>
            <Button style={{width: 'auto', marginRight: 8}} onClick={() => form.resetFields()}>重置</Button>
            <Button style={{width: 'auto'}} type="primary" onClick={() => {
              form.validateFields().then(values => {
                setCachedQueryFormData(values)
                const {year: queryFormYear} = values
                if (queryFormYear !== year) setYear(queryFormYear)
                else getTableData(values)
              })
            }}>查询</Button>
          </>
        )
      },
    ]
  ]
  useEffect(() => {
    form.setFieldValue(['year'], year)
    getTableData({year})
  }, [year])
  return (
    <div className={styles['inspection-report']}>
      <CustomForm form={form} formItems={formItems} initialValues={defaultQueryFormData} />
      <Table
        rowKey={'id'}
        style={{height: `calc(100% - 40px`}}
        loading={tb_load}
        size="small"
        columns={listColumns()}
        dataSource={tb_data}
        scroll={{x: "max-content", y: `calc(100vh - 347px)`}}
        pagination={false}
        bordered
      ></Table>
      <ModalForm
        isEdit={isEdit}
        open={open}
        setOpen={setOpen}
        refresh={getTableData}
        row={curData}
        planInfo={planInfo}
      ></ModalForm>
    </div>
  )
}
export default InspectionReport
