import styles from '../../style/index.module.less'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'
import {
  Button,
  Collapse,
  DatePicker,
  Form,
  Input,
  message,
  Popconfirm,
  Popover,
  Radio,
  Select,
  Table,
  Tag,
  Upload
} from 'antd'
import dayjs from 'dayjs'
import MultiSelect from '../../../../../../../components/CustomSeries/MultiSelect.jsx'
import {dutiesOptions} from '../../../SchemeManagement/SchemeForm/index.jsx'
import {DownloadOutlined, EyeOutlined, SearchOutlined, UploadOutlined} from '@ant-design/icons'
import {useEffect, useMemo, useRef, useState} from 'react'
import SystemInputModal from './SystemInputModal.jsx'
import ResponsiblePartyModal from './ResponsiblePartyModal.jsx'
import SystemVerifyModal from './SystemVerifyModal.jsx'
import InternalReportModal from './InternalReportModal.jsx'
import {
  approval_internal_audit_report, close_case,
  confirm_non_conformance,
  delete_non_conformance,
  read_internal_audit_report,
  read_non_conformance, real_review,
  uploadLastMeeting
} from '@/apis/qms_router.jsx'
import {deptOptions} from '../InternalAuditChecklist/index.jsx'
import NonConformanceDistModal from './NonConformanceDistModal.jsx'
import FilePreview from "@/pages/Manage/QMS/ProjectQuality/component/FilePreview.jsx";

const NonConformanceReport = ({planInfo, getPlanInfo, meetingSignInData, getMeetingSignInData, year, setYear}) => {
  const implementStatus = useMemo(() => planInfo.status, [planInfo])
  const [isSystemInputEdit, setIsSystemInputEdit] = useState(false)
  const [queryForm] = Form.useForm()
  const [approvePopForm] = Form.useForm()
  const [tb_load, setTbLoad] = useState(false)
  const [tb_data, setTbData] = useState([])
  const [curData, setCurData] = useState({})
  const [systemInputModalOpen, setSystemInputModalOpen] = useState(false)
  const [responsiblePartyModalOpen, setResponsiblePartyModalOpen] = useState(false)
  const [systemVerifyModalOpen, setSystemVerifyModalOpen] = useState(false)
  const [internalReportModalOpen, setInternalReportModalOpen] = useState(false)
  const [nonConformanceDistModalOpen, setNonConformanceDistModalOpen] = useState(false)
  const [approvePopOpen, setApprovePopOpen] = useState(false)
  const [isInternalReportExist, setIsInternalReportExist] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewHtmlContent, setPreviewHtmlContent] = useState('')
  const [fileBlob, setFileBlob] = useState(null)
  const userInfo = JSON.parse(sessionStorage.getItem('user_info'))
  const defaultQueryFormData = {
    year: year,
    audited_department: '',
    reviewer: ''
  }
  const [cachedQueryFormData, setCachedQueryFormData] = useState(defaultQueryFormData)
  const getNonConformanceList = (formData = cachedQueryFormData) => {
    setTbLoad(true)
    read_non_conformance(
      formData,
      ({data: {data}}) => {
        setTbData(data.map(i => ({...i, key: i.id})))
        setTbLoad(false)
      },
      () => {
        setTbLoad(false)
        setTbData([])
      }
    )
  }
  const getInternalReportStatus = () => {
    read_internal_audit_report(
      {year},
      ({data: {data}}) => {
        const {implementation_status} = (data ?? {})
        // 检测其中一个值
        const {audit_overview} = (implementation_status ?? {})
        setIsInternalReportExist(!!audit_overview)
      }
    )
  }
  const handleConfirm = () => {
    if (!meetingSignInData?.last) {
      message.warning('请先上传末次会议签到表！')
      return
    }
    confirm_non_conformance(
      {review_plan_id: planInfo.id},
      (res) => {
        message.success('不符合项检查表确认成功！')
        getPlanInfo()
        getNonConformanceList()
      }
    )
  }
  const handleApprove = () => {
    approvePopForm.validateFields()
    .then(values => {
      approval_internal_audit_report(
        {review_plan_id: planInfo.id, ...values},
        (res => {
          message.success('审批完成')
          setApprovePopOpen(false)
          getPlanInfo()
        })
      )
    })
  }
  const handleClose = () => {
    close_case(
      {review_plan_id: planInfo.id},
      (res) => {
        message.success('关闭成功')
        getPlanInfo()
      }
    )
  }
  const isOperator = (node, row) => {
    if (node === 'system_input' || node === 'system_verify') {
      const {auditor} = row
      const {audit_team} = planInfo
      const operators = []
      auditor.forEach(team => {
        const teamInfo = audit_team.find(item => team === item.team_name)
        teamInfo && operators.push(teamInfo.group_leader, ...teamInfo.team_members)
      })
      return operators.includes(userInfo.user_id) || userInfo.username === 'admin' || userInfo.username === '10000411'
    } else if (node === 'responsible_party') {
      const {person_in_change} = row
      return person_in_change === userInfo.user_id
    } else {
      return false
    }
  }
  const deleteRow = (record) => {
    const {id} = record
    delete_non_conformance(
      {id},
      ({data: {data}}) => {
        message.success('删除成功')
        getNonConformanceList()
      },
      () => {
      }
    )
  }
  const handleDownloadAttachment = (url, filename) => {
    fetch(url)
    .then(response => {
      if (response.status === 200) {
        response.blob().then(function (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        });
      }
    })
  }
  const handlePreview = ({url, filename}) => {
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const file = new File([blob], filename, {type: blob.type});
      setFileBlob(file);
      const formData = new FormData();
      formData.append('file', file);
      real_review(formData,
        ({data}) => {
          setPreviewHtmlContent(data);
          setPreviewModalOpen(true);
        });
    })
  }
  const handleDownload = () => {
    const url = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileBlob.name;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
  const genColumns = () => [
    {
      title: '体系填写',
      children: [
        {
          title: '不合格等级',
          dataIndex: 'non_conformance_class',
          width: 180
        },
        {
          title: '受审核方',
          dataIndex: 'auditee',
          width: 100
        },
        {
          title: '审核日期',
          dataIndex: 'approved_date',
          width: 120
        },
        {
          title: '审核员',
          dataIndex: 'auditor',
          width: 80,
          render: (text) => text?.join('，')
        },
        {
          title: '问题发生地点',
          dataIndex: 'location_of_problem',
          width: 200
        },
        {
          title: '陪同人员',
          dataIndex: 'accompanying_personnel',
          width: 160,
          render: (text) => text?.map(({nick_name}) => nick_name).join('，')
        },
        {
          title: '不符合项描述',
          dataIndex: 'description',
          width: 160
        },
        {
          title: '担当人',
          dataIndex: 'person_in_change_name',
          width: 100
        },
        {
          title: '整改计划完成时间',
          dataIndex: 'planned_completion_time',
          width: 200
        },
      ]
    },
    {
      title: '责任部门整改',
      children: [
        {
          title: '原因分析',
          dataIndex: 'cause_analysis',
          width: 200
        },
        {
          title: '纠正措施',
          dataIndex: 'corrective_action',
          width: 200
        },
        {
          title: '预防措施',
          dataIndex: 'preventive_measure',
          width: 200
        },
        {
          title: '整改证据',
          dataIndex: 'rectification_evidence',
          width: 200,
          render: (text, record) => {
            let newFiles = Array.isArray(text) ? text : []
            return (
              <>
                {newFiles.map(({url, filename}, index) => (
                  <Button
                    key={index}
                    variant={'text'}
                    color={'primary'}
                    style={{margin: index === newFiles.length - 1 ? '0' : '0 8px 8px 0'}}
                    onClick={() => handlePreview({url, filename})}
                  >{filename}</Button>
                ))}
              </>
            )
          }
        },
        {
          title: '关闭时间',
          dataIndex: 'closing_time',
          width: 140
        }
      ]
    },
    {
      title: '体系验证',
      children: [
        {
          title: '验证结果',
          dataIndex: 'verify',
          width: 100,
          render: (_, record) => {
            const {verify, status} = record
            let color = '', content = '';
            if (status === '3' && verify === 'Y') {
              content = '通过'
              color = 'success'
            } else if (status === '3' && verify !== 'Y') {
              content = '待审核'
            } else if (status === '2' && verify === 'N') {
              content = '驳回'
              color = 'error'
            }
            return <Tag color={color}>{content}</Tag>
          }
        },
        {
          title: '验证意见',
          dataIndex: 'verifier_signature',
          width: 140
        },
      ]
    },
    {
      title: '操作',
      fixed: 'right',
      width: 400,
      render: (_, record) => {
        return (
          <>
            <Popconfirm title={'确定删除该条数据吗？'} onConfirm={() => deleteRow(record)}>
              <Button variant="text" color={'danger'} disabled={implementStatus !== 'C06'}>删除</Button>
            </Popconfirm>
            <Button
              variant="text"
              color={'green'}
              disabled={implementStatus !== 'C06' || record.status !== '1' || !isOperator('system_input', record)}
              onClick={() => {
                setIsSystemInputEdit(true)
                setSystemInputModalOpen(true)
                setCurData({...record})
              }}>体系填写</Button>
            <Button
              variant="text"
              color={'primary'}
              disabled={implementStatus !== 'C09' || record.status !== '2' && record.status !== '2.1' || !isOperator('responsible_party', record)}
              onClick={() => {
                setResponsiblePartyModalOpen(true)
                setCurData({...record})
              }}>责任部门填写</Button>
            <Button
              variant="text"
              color={'gold'}
              disabled={implementStatus !== 'C09' || record.status !== '3' || record.is_confirmed || !isOperator('system_verify', record)}
              onClick={() => {
                setSystemVerifyModalOpen(true)
                setCurData({...record})
              }}>体系验证</Button>
          </>
        )
      }
    }
  ]
  const queryFormItems = [
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
            <Button style={{width: 'auto', marginRight: 8}} onClick={() => queryForm.resetFields()}>重置</Button>
            <Button style={{width: 'auto'}} type="primary" onClick={() => {
              queryForm.validateFields().then((values) => {
                setCachedQueryFormData(values)
                const {year: queryFormYear} = values
                if (queryFormYear !== year) setYear(queryFormYear)
                else getNonConformanceList(values)
              })
            }}>查询</Button>
          </>
        )
      },
      {
        span: 8,
        formItem: (
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button style={{marginRight: 8}} disabled={implementStatus !== 'C06'} onClick={() => {
              setIsSystemInputEdit(false)
              setSystemInputModalOpen(true)
            }}>新建不符合项</Button>
            <Upload
              customRequest={({file}) => {
                const formData = new FormData()
                formData.append('meeting_file', file)
                formData.append('review_plan_id', JSON.stringify({review_plan_id: planInfo.id}))
                uploadLastMeeting(undefined, formData, () => {
                  message.success('上传成功！')
                  getMeetingSignInData()
                })
              }}
              showUploadList={false}>
              <Button disabled={implementStatus !== 'C06'} style={{marginRight: 8}}
                      icon={<UploadOutlined />}>上传末次会议签到表</Button>
            </Upload>
            <Popconfirm
              style={{width: 350}}
              trigger="click"
              onConfirm={handleConfirm}
              title={'确认不符合项'}
              description={'请确认体系填写项内容无误！'}>
              <Button variant="solid" color={'primary'} disabled={implementStatus !== 'C06'}>确认不符合项</Button>
            </Popconfirm>
          </div>
        )
      }
    ],
    [
      {
        span: 24, formItem: (
          <div style={{display: 'flex', justifyContent: 'flex-start'}}>
            <Button
              style={{marginRight: 8}}
              variant={'solid'}
              color={'cyan'}
              onClick={() => setNonConformanceDistModalOpen(true)}
              disabled={implementStatus !== 'C07' && implementStatus !== 'C09' && implementStatus !== 'D04'}
            >不符合项分布表</Button>
            <Popover
              style={{width: 350}}
              trigger="click"
              title={null}
              content={
                <CustomForm
                  style={{width: 260}}
                  formItems={
                    [
                      [{
                        span: 24,
                        label: '首次会议签到表',
                        name: '1',
                        formItem: (
                          <Button
                            disabled={!meetingSignInData.first}
                            style={{width: 'auto'}}
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownloadAttachment(meetingSignInData.first, meetingSignInData.first_filename)}
                          >点击下载查看</Button>
                        )
                      }],
                      [{
                        span: 24,
                        label: '末次会议签到表',
                        name: '1',
                        formItem: (
                          <Button
                            disabled={!meetingSignInData.last}
                            style={{width: 'auto'}}
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownloadAttachment(meetingSignInData.last, meetingSignInData.last_filename)}
                          >点击下载查看</Button>
                        )
                      }]
                    ]
                  }>
                </CustomForm>
              }>
              <Button
                style={{marginRight: 8}}
                variant={'solid'}
                color={'volcano'}
              >查看会议签到表</Button>
            </Popover>
            <Button
              style={{marginRight: 8}}
              variant={'solid'}
              color={'primary'}
              disabled={implementStatus !== 'C07' && implementStatus !== 'C09' && implementStatus !== 'D04'}
              onClick={() => setInternalReportModalOpen(true)}
            >内部审核报告</Button>
            <Popover
              trigger="click"
              open={approvePopOpen}
              onCancel={() => setApprovePopOpen(false)}
              title={'请确认并审批内部审核报告'}
              content={(
                <CustomForm
                  style={{width: 220}}
                  form={approvePopForm}
                  formItems={[
                    [{
                      span: 24,
                      label: '审批结果',
                      name: 'is_pass',
                      rules: [{required: true, message: '请填写审批结果'}],
                      formItem: (
                        <Radio.Group options={[{label: '通过', value: true}, {label: '不通过', value: false}]} />)
                    }],
                    [{
                      span: 24,
                      formItem: (
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                          <Button size={'small'} style={{marginRight: 8}}
                                  onClick={() => setApprovePopOpen(false)}>取消</Button>
                          <Button size={'small'} type={'primary'} onClick={handleApprove}>确认</Button>
                        </div>
                      )
                    }]
                  ]}>
                </CustomForm>
              )}>
              <Button
                style={{marginRight: 8}}
                variant={'solid'}
                color={'danger'}
                disabled={implementStatus !== 'C07' || !isInternalReportExist}
                onClick={() => setApprovePopOpen(true)}
              >审批</Button>
            </Popover>
            <Popconfirm
              style={{width: 350}}
              trigger="click"
              onConfirm={handleClose}
              title={'结案'}
              description={'请确认该年度体系内审是否结案！'}>
              <Button variant={'solid'} color={'green'}
                      disabled={implementStatus !== 'C09' || !tb_data.every(i => i.is_confirmed)}>结案</Button>
            </Popconfirm>
          </div>
        )
      }
    ]
  ]
  useEffect(() => {
    queryForm.setFieldValue(['year'], year)
    getNonConformanceList({...cachedQueryFormData, year})
    getInternalReportStatus()
  }, [year]);
  return (
    <div className={styles['non-conformance-report']}>
      <CustomForm form={queryForm} formItems={queryFormItems} initialValues={defaultQueryFormData} />
      <Table
        loading={tb_load}
        size="small"
        columns={genColumns()}
        dataSource={tb_data}
        scroll={{x: "max-content", y: `calc(100vh - 387px)`}}
        pagination={false}
        bordered
      ></Table>
      <SystemInputModal
        open={systemInputModalOpen}
        setOpen={setSystemInputModalOpen}
        isEdit={isSystemInputEdit}
        row={curData}
        planInfo={planInfo}
        refresh={getNonConformanceList}
      ></SystemInputModal>
      <NonConformanceDistModal
        open={nonConformanceDistModalOpen}
        setOpen={setNonConformanceDistModalOpen}
        planInfo={planInfo}
      ></NonConformanceDistModal>
      <ResponsiblePartyModal
        open={responsiblePartyModalOpen}
        setOpen={setResponsiblePartyModalOpen}
        row={curData}
        refresh={getNonConformanceList}
      ></ResponsiblePartyModal>
      <SystemVerifyModal
        open={systemVerifyModalOpen}
        setOpen={setSystemVerifyModalOpen}
        row={curData}
        refresh={getNonConformanceList}
      ></SystemVerifyModal>
      <InternalReportModal
        setIsInternalReportExist={setIsInternalReportExist}
        planInfo={planInfo}
        year={year}
        open={internalReportModalOpen}
        setOpen={setInternalReportModalOpen}
        isDisabled={implementStatus !== 'C07'}
        columns={genColumns()[0].children}
      ></InternalReportModal>
      <FilePreview
        htmlContent={previewHtmlContent}
        open={previewModalOpen}
        setOpen={setPreviewModalOpen}
        footer={[
          <Button
            key={'download'}
            type={'primary'}
            style={{marginRight: 8}}
            onClick={() => handleDownload()}
          >下载</Button>
        ]}
      ></FilePreview>
    </div>
  )
}
export default NonConformanceReport;
