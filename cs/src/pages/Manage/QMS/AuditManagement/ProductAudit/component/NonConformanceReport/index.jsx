import styles from '@/pages/Manage/QMS/AuditManagement/SystemAudit/style/index.module.less'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {Button, DatePicker, Form, message, Popconfirm, Select, Table, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {del_product_non_conformance, read_product_non_conformance} from '@/apis/qms_router.jsx'
import {SearchOutlined, UploadOutlined} from '@ant-design/icons'
import ModalForm from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/NonConformanceReport/ModalForm.jsx'
import {DefectCoefficient} from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionStandard/ModalForm.jsx'
import {readUsers} from '@/apis/auth_api.jsx'

export const ReviewDecision = [
  {label: '放行', value: '放行'},
  {label: '扣压', value: '扣压'}
]
export const IsWhether = [
  {label: '是', value: '是'},
  {label: '否', value: '否'}
]
const ProductNonConformanceReport = ({planInfo, year, setYear}) => {
  const [form] = Form.useForm()
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [curData, setCurData] = useState({})
  const [userOptions, setUserOptions] = useState([])
  const handleAddRow = () => {
    setOpen(true)
    setIsEdit(false)
  }
  const handleDeleteRow = (row) => {
    del_product_non_conformance(
      {id: row.id},
      () => {
        message.success(`删除成功`)
        getTableData()
      }
    )
  }
  const handleUserSearch = (params) => {
    readUsers(
      params,
      ({data: {data: {user}}}) => {
        setUserOptions(user.map(({user_id: value, nick_name: label}) => ({label, value})))
      }
    )
  }
  const defaultQueryFormData = {year: String(new Date().getFullYear())}
  const [cachedQueryFormData, setCachedQueryFormData] = useState(defaultQueryFormData)
  const listColumns = () => [
    {
      title: '审核日期',
      dataIndex: 'approved_date',
      width: 120
    },
    {
      title: '审核区域/工序',
      dataIndex: 'process',
      width: 120
    },
    {
      title: '要素编号',
      dataIndex: 'element_number',
      width: 120
    },
    {
      title: '不符合项描述',
      dataIndex: 'description',
      width: 120
    },
    {
      title: '原因分析',
      dataIndex: 'cause_analysis',
      width: 120
    },
    {
      title: '整改措施',
      dataIndex: 'rectification_measure',
      width: 120
    },
    {
      title: '担当人',
      dataIndex: 'responsible_person',
      width: 120,
      render: text => userOptions.find(item => item.value === text)?.label
    },
    {
      title: '计划完成时间',
      dataIndex: 'planned_completion_time',
      width: 120
    },
    {
      title: '问题关闭时间',
      dataIndex: 'problem_closure_time',
      width: 120
    },
    {
      title: '整改证据',
      dataIndex: 'rectification_evidence',
      width: 120
    },
    {
      title: '文件验证',
      dataIndex: 'file_validation',
      width: 120,
    },
    {
      title: '现场验证',
      dataIndex: 'on_site_verification',
      width: 120,
    },
    {
      title: '验证人',
      dataIndex: 'signature',
      width: 120,
      render: text => userOptions.find(item => item.value === text)?.label
    },
    {
      title: '验证时间',
      dataIndex: 'signature_date',
      width: 120,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 140,
      render: (_, record) => {
        return (
          <>
            <Button variant="text" color={'primary'} onClick={() => {
              setIsEdit(true)
              setOpen(true)
              setCurData({...record})
            }}>编辑</Button>
            <Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => handleDeleteRow(record)}>
              <Button variant="text" color={'danger'}>删除</Button>
            </Popconfirm>
          </>
        )
      }
    }
  ]
  const getTableData = (formData = cachedQueryFormData) => {
    setTbLoad(true)
    read_product_non_conformance(
      formData,
      ({data: {data}}) => {
        setTbData(data)
        const userList = []
        data.forEach(row => {
          const {signature, responsible_person,} = row
          typeof signature === 'number' && userList.push(signature)
          typeof responsible_person === 'number' && userList.push(responsible_person)
          handleUserSearch({user_id: Array.from(new Set(userList)).join()})
        })
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
      {
        span: 16, formItem: (
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button onClick={handleAddRow} style={{marginRight: 8}}>新建</Button>
          </div>
        )
      }
    ]
  ]
  useEffect(() => {
    form.setFieldValue(['year'], year)
    getTableData({year})
  }, [year])
  return (
    <div className={styles['non-conformance-report']}>
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
export default ProductNonConformanceReport


