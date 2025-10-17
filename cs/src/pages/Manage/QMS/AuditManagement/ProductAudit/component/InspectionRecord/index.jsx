import styles from '@/pages/Manage/QMS/AuditManagement/SystemAudit/style/index.module.less'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {Button, DatePicker, Form, message, Popconfirm, Select, Table, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {del_inspection_record, del_inspection_standard, read_inspection_record, read_inspection_standard} from '@/apis/qms_router.jsx'
import {SearchOutlined, UploadOutlined} from '@ant-design/icons'
import ModalForm from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionRecord/ModalForm.jsx'
import {DefectCoefficient} from '@/pages/Manage/QMS/AuditManagement/ProductAudit/component/InspectionStandard/ModalForm.jsx'

const DefectCoefficientMap = {
  A: 10, B: 5, C: 1
}
const InspectionRecord = ({planInfo, year, setYear}) => {
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
    del_inspection_record(
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
      title: '审核日期',
      dataIndex: 'approved_date',
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
      title: '检验依据',
      dataIndex: 'inspection_basis',
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
            {/*<Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => handleDeleteRow(record)}>
              <Button variant="text" color={'danger'}>删除</Button>
            </Popconfirm>*/}
          </>
        )
      }
    }
  ]
  const preColumns = [
    {
      dataIndex: 'key',
      title: '序号',
      width: 80,
      render: (_, record, index) => index + 1
    },
    {
      dataIndex: 'technical_specification',
      title: '检测项目/技术规范',
      width: 150,
    },
    {
      dataIndex: 'evaluation_technique',
      title: '测量评价技术',
      width: 120,
    },
    {
      dataIndex: 'testing_equipment',
      title: '检测设备',
      width: 150,
    },
    {
      dataIndex: 'defect_coefficient',
      title: '缺陷系数',
      width: 130,
      render: (text, record) => {
        return DefectCoefficient.find(item => item.value === text)?.label ?? ''
      }
    },
    {
      dataIndex: 'sample_quantity',
      title: '抽样数量',
      width: 100,
    },
    {
      dataIndex: 'nXf',
      title: 'nXf',
      width: 80,
    },
  ]
  const sufColumns = [
    {
      dataIndex: 'defect_number',
      title: '缺陷个数',
      width: 80,
    },
    {
      dataIndex: 'defect_score',
      title: '缺陷分数',
      width: 80,
    },
  ]
  const getTableData = (formData = cachedQueryFormData) => {
    setTbLoad(true)
    read_inspection_record(
      formData,
      ({data: {data}}) => {
        setTbData(data.map(({record_items, ...rest}) => ({record_items: record_items.map((item, index) => ({...item, key: index})), ...rest})))
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
      // {
      //   span: 16, formItem: (
      //     <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      //       <Button onClick={handleAddRow} style={{marginRight: 8}}>新建</Button>
      //     </div>
      //   )
      // }
    ]
  ]
  useEffect(() => {
    form.setFieldValue(['year'], year)
    getTableData({year})
  }, [year])
  return (
    <div className={styles['inspection-record']}>
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
            const {record_items: recordItems} = record
            const sumRecordTimes = recordItems.reduce((sum, item) => {
              sum = Math.max(sum, item.sample_quantity)
              return sum
            }, 0)
            const sumRecordColumns = []
            for (let i = 0, l = sumRecordTimes; i < l; i++) {
              sumRecordColumns.push({
                dataIndex: ['sample_testing_records', i],
                title: `记录${i + 1}`,
                width: 100,
              })
            }
            const itemColumns = [...preColumns, ...sumRecordColumns, ...sufColumns]
            return (
              <Table
                bordered
                rowKey={'key'}
                dataSource={recordItems}
                columns={itemColumns}
                size="small"
                scroll={{x: "max-content"}}
                pagination={false}
              ></Table>
            )
          },
          expandIcon: ({expanded, onExpand, record}) => (
            <Button icon={<SearchOutlined />} color="primary" variant="text" onClick={e => onExpand(record, e)}>查看检验记录</Button>
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
export default InspectionRecord
