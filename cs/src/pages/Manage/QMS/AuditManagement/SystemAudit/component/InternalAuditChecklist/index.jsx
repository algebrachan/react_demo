import styles from '../../style/index.module.less'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'
import {Button, DatePicker, Form, Input, message, Popconfirm, Popover, Radio, Select, Table, Upload} from 'antd'
import dayjs from 'dayjs'
import {dutiesOptions} from '../../../SchemeManagement/SchemeForm/index.jsx'
import MultiSelect from '../../../../../../../components/CustomSeries/MultiSelect.jsx'
import {useEffect, useMemo, useRef, useState} from 'react'
import {DownloadOutlined, SearchOutlined, UploadOutlined} from '@ant-design/icons'
import ChecklistModal from './ChecklistModal.jsx'
import CheckItemModal from './CheckItemModal.jsx'
import {
  confirm_internal_checklist,
  delete_audit_checklist,
  delete_audit_checklist_item,
  read_audit_checklist,
  uploadFirstMeeting
} from '../../../../../../../apis/qms_router.jsx'

export const deptOptions = [
  {
    value: '全部部门',
    label: '全部部门'
  },
  {
    value: '总经理室',
    label: '总经理室'
  },
  {
    value: '计划部',
    label: '计划部'
  },
  {
    value: '研发技术部',
    label: '研发技术部'
  },
  {
    value: '制造部',
    label: '制造部'
  },
  {
    value: '制造部-设备动力科',
    label: '制造部-设备动力科'
  },
  {
    value: '制造部-原料合成车间',
    label: '制造部-原料合成车间'
  },
  {
    value: '制造部-长晶生产车间',
    label: '制造部-长晶生产车间'
  },
  {
    value: '制造部-坩埚车间',
    label: '制造部-坩埚车间'
  },
  {
    value: '质量管理部',
    label: '质量管理部'
  },
  {
    value: '安环部',
    label: '安环部'
  },
  {
    value: '销售部',
    label: '销售部'
  },
  {
    value: '人力资源部',
    label: '人力资源部'
  },
  {
    value: '财务部',
    label: '财务部'
  },
  {
    value: '信息部',
    label: '信息部'
  },
  {
    value: '园区行政办公室',
    label: '园区行政办公室'
  },
  {
    value: '项目开发部',
    label: '项目开发部'
  }
]
const InternalAuditChecklist = ({planInfo, getPlanInfo, meetingSignInData, getMeetingSignInData, year, setYear}) => {
  const implementStatus = useMemo(() => planInfo.status, [planInfo])
  const [form] = Form.useForm()
  const [tb_list_load, setTbListLoad] = useState(false)
  const [tb_list_data, setTbListData] = useState([])
  const [listModalOpen, setListModalOpen] = useState(false)
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [isListEdit, setIsListEdit] = useState(false)
  const [isItemEdit, setIsItemEdit] = useState(false)
  const [listCurData, setListCurData] = useState(null)
  const [itemCurData, setItemCurData] = useState(null)
  const handleAddRow = () => {
    setListModalOpen(true)
    setIsListEdit(false)
  }
  const defaultQueryFormData = {
    year: year,
    audited_department: '',
    reviewer: ''
  }
  const [cachedQueryFormData, setCachedQueryFormData] = useState(defaultQueryFormData)
  const getChecklist = (formData = cachedQueryFormData) => {
    setTbListLoad(true)
    read_audit_checklist(
      formData,
      ({data: {data}}) => {
        setTbListData(data.map(item => {
          const {items: checkItems, ...rest} = item
          const newItems = checkItems.map(checkItem => ({...checkItem, key: checkItem.id}))
          return {...rest, items: newItems, key: item.id}
        }))
        setTbListLoad(false)
      },
      (err) => {
        setTbListData([])
        setTbListLoad(false)
      }
    )
  }
  const deleteListRow = (record) => {
    delete_audit_checklist(
      {id: record.id},
      () => {
        message.success('删除成功')
        getChecklist()
      },
      (err) => message.error('删除失败')
    )
  }
  const deleteItemRow = (record) => {
    delete_audit_checklist_item(
      {id: record.id},
      () => {
        message.success('删除成功')
        getChecklist()
      },
      (err) => message.error('删除失败'))
  }
  const handleConfirm = () => {
    if (!meetingSignInData?.first) {
      message.warning('请先上传首次会议签到表！')
      return
    }
    confirm_internal_checklist(
      {review_plan_id: planInfo.id},
      (res) => {
        message.success('检查表确认成功，请前往不符合项处理！')
        getPlanInfo()
      }
    )
  }
  const listColumns = () => [
    {
      title: '受审部门',
      dataIndex: 'audited_department',
      width: 150
    },
    {
      title: '审核人员',
      dataIndex: 'reviewer',
      width: 180,
      render: (text) => text?.join('，')
    },
    {
      title: '过程名称',
      dataIndex: 'procedure_name',
      width: 220,
      render: (text) => text?.join('，')
    },
    {
      title: '过程程序及编号',
      dataIndex: 'procedure_number',
      width: 220,
    },
    {
      title: '陪同人员',
      dataIndex: 'accompanying_personnel',
      width: 200,
      render: (text) => text?.map(({nick_name}) => nick_name).join('，')
    },
    {
      title: '审核日期',
      dataIndex: 'approved_date',
      width: 180
    },
    {
      title: '操作',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Button variant="text" color={'green'} disabled={implementStatus !== 'C04'} onClick={() => {
              setIsItemEdit(false)
              setItemModalOpen(true)
              setListCurData({...record})
            }}>新建检查项</Button>
            <Button variant="text" color={'primary'} disabled={implementStatus !== 'C04'} onClick={() => {
              setIsListEdit(true)
              setListModalOpen(true)
              setListCurData({...record})
            }}>编辑</Button>
            <Popconfirm title={'删除该条数据的同时，会删除其下所有检查项，确定删除该条数据吗？'} onConfirm={() => deleteListRow(record)}>
              <Button variant="text" color={'danger'} disabled={implementStatus !== 'C04'}>删除</Button>
            </Popconfirm>
          </>
        )
      }
    }
  ]
  const itemColumns = () => [
    {
      title: '检查要点',
      dataIndex: 'inspection_point',
    },
    {
      title: '支持过程/管理过程',
      dataIndex: 'process',
    },
    {
      title: '标准条款',
      dataIndex: 'standard_terms',
    },
    {
      title: '审核记录',
      dataIndex: 'audit_records',
    },
    {
      title: '判定',
      dataIndex: 'judge',
    },
    {
      title: '操作',
      fixed: 'right',
      render: (_, record) => {
        return (
          <>
            <Button variant="text" color={'primary'} disabled={implementStatus !== 'C04'} onClick={() => {
              setIsItemEdit(true)
              setItemModalOpen(true)
              setItemCurData({...record})
            }}>编辑</Button>
            <Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => deleteItemRow(record)}>
              <Button variant="text" color={'danger'} disabled={implementStatus !== 'C04'}>删除</Button>
            </Popconfirm>
          </>
        )
      }
    }
  ]
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
        span: 4,
        name: 'audited_department',
        label: '受审部门',
        formItem: <Select options={deptOptions} />
      },
      {
        span: 4,
        name: 'reviewer',
        label: '审核人员',
        formItem: <Select options={planInfo.audit_team?.map(({team_name: value}) => ({label: value, value}))} />
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
                else getChecklist(values)
              })
            }}>查询</Button>
          </>
        )
      },
      {
        span: 8, formItem: (
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button disabled={implementStatus !== 'C04'} onClick={handleAddRow} style={{marginRight: 8}}>新建</Button>
            <Upload
              customRequest={({file}) => {
                const formData = new FormData()
                formData.append('meeting_file', file)
                formData.append('review_plan_id', JSON.stringify({review_plan_id: planInfo.id}))
                uploadFirstMeeting(undefined, formData, () => {
                  message.success('上传成功！')
                  getMeetingSignInData()
                })
              }}
              showUploadList={false}>
              <Button disabled={implementStatus !== 'C04'} style={{marginRight: 8}} icon={<UploadOutlined />}>上传首次会议签到表</Button>
            </Upload>
            <Popconfirm
              style={{width: 350}}
              trigger="click"
              onConfirm={handleConfirm}
              title={'确认检查表'}
              description={'请确认检查表填写无误！'}>
              <Button disabled={implementStatus !== 'C04'} type="primary">确认检查表</Button>
            </Popconfirm>
          </div>
        )
      }
    ]
  ]
  useEffect(() => {
    form.setFieldValue(['year'], year)
    getChecklist({...cachedQueryFormData, year})
  }, [year])
  return (
    <div className={styles['internal-audit-checklist']}>
      <CustomForm form={form} formItems={formItems} initialValues={defaultQueryFormData} />
      <Table
        style={{height: `calc(100% - 40px`}}
        loading={tb_list_load}
        size="small"
        columns={listColumns()}
        dataSource={tb_list_data}
        scroll={{x: "max-content", y: `calc(100vh - 347px)`}}
        pagination={false}
        bordered
        expandable={{
          expandedRowRender: (record) => {
            return (
              <Table
                bordered
                dataSource={record.items}
                columns={itemColumns()}
                size="small"
                scroll={{x: "max-content"}}
                pagination={false}
              ></Table>
            )
          },
          expandIcon: ({expanded, onExpand, record}) => (
            <Button icon={<SearchOutlined />} color="primary" variant="text" onClick={e => onExpand(record, e)}>查看检查项</Button>
          ),
        }}
      ></Table>
      <ChecklistModal open={listModalOpen} setOpen={setListModalOpen} refresh={getChecklist} row={listCurData} isEdit={isListEdit}
                      planInfo={planInfo}></ChecklistModal>
      <CheckItemModal open={itemModalOpen} setOpen={setItemModalOpen} refresh={getChecklist} row={itemCurData} isEdit={isItemEdit}
                      listData={listCurData}></CheckItemModal>
    </div>
  );
};
export default InternalAuditChecklist;
