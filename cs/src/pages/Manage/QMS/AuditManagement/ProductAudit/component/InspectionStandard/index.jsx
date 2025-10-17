import styles from '@/pages/Manage/QMS/AuditManagement/SystemAudit/style/index.module.less'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {Button, DatePicker, Form, message, Popconfirm, Select, Table, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {del_inspection_standard, read_inspection_standard} from '@/apis/qms_router.jsx'
import {SearchOutlined, UploadOutlined} from '@ant-design/icons'
import ModalForm from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionStandard/ModalForm.jsx'

const InspectionStandard = ({planInfo, year, setYear}) => {
  const [form] = Form.useForm()
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [curData, setCurData] = useState(null)
  const handleAddRow = () => {
    setOpen(true)
    setIsEdit(false)
  }
  const handleDeleteRow = (row) => {
    del_inspection_standard(
      {id: row.id},
      () => {
        message.success(`删除成功`)
        getTableData()
      })
  }
  const defaultQueryFormData = {year: String(new Date().getFullYear())}
  const [cachedQueryFormData, setCachedQueryFormData] = useState(defaultQueryFormData)
  const getTableData = (formData = cachedQueryFormData) => {
    setTbLoad(true)
    read_inspection_standard(
      formData,
      ({data: {data}}) => {
        setTbData(data.map(({standard_items, ...rest}) => ({standard_items: standard_items.map((item, index) => ({...item, key: index})), ...rest})))
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
  const listColumns = () => [
    {
      title: '产品名称',
      dataIndex: 'product_name',
      width: 120
    },
    {
      title: '产品图号',
      dataIndex: 'product_drawing_number',
      width: 120
    },
    {
      title: '顾客名称',
      dataIndex: 'customer_name',
      width: 120
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 120
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
            <Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => handleDeleteRow(record)}>
              <Button variant="text" color={'danger'}>删除</Button>
            </Popconfirm>
          </>
        )
      }
    }
  ]
  const itemColumns = () => [
    {
      dataIndex: 'key',
      title: '序号',
      width: 80,
      render: (_, record, index) => index + 1
    },
    {
      dataIndex: 'technical_specification',
      title: '检测项目/技术规范',
      width: 200,
    },
    {
      dataIndex: 'evaluation_technique',
      title: '测量评价技术',
      width: 200,
    },
    {
      dataIndex: 'sample_quantity',
      title: '抽样数量',
      width: 200,
    },
    {
      dataIndex: 'defect_coefficient',
      title: '缺陷分类',
      width: 200,
    },
  ]
  useEffect(() => {
    form.setFieldValue(['year'], year)
    getTableData({year})
  }, [year])
  return (
    <div className={styles['inspection-standard']}>
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
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Table
                bordered
                rowKey={'key'}
                dataSource={record.standard_items}
                columns={itemColumns()}
                size="small"
                scroll={{x: "max-content"}}
                pagination={false}
              ></Table>
            )
          },
          expandIcon: ({expanded, onExpand, record}) => (
            <Button icon={<SearchOutlined />} color="primary" variant="text" onClick={e => onExpand(record, e)}>查看检验标准</Button>
          ),
        }}
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
export default InspectionStandard
