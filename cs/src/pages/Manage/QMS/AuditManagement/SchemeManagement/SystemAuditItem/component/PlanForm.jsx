import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'
import {DatePicker, Form, Input} from 'antd'
import {EditTable} from '../../../../ChangeMng/ChangeTracking/component/EditTable.jsx'
import {readUsers} from '../../../../../../../apis/auth_api.jsx'
import dayjs from 'dayjs'
import {dutiesOptions} from '../../SchemeForm'
import {deptOptions} from "@/pages/Manage/QMS/AuditManagement/SystemAudit/component/InternalAuditChecklist/index.jsx";

const PlanForm = forwardRef((props, ref) => {
  const {isDisabled = false, formData = {}} = props
  const [form] = Form.useForm()
  const [userOptions, setUserOptions] = useState([])
  const [criteriaTbData, setCriteriaTbData] = useState([])
  const [auditTeamTbData, setAuditTeamTbData] = useState([])
  const [auditScheduleTbData, setAuditScheduleTbData] = useState([])
  const criteriaColumns = [{
    dataIndex: 'method',
    title: '依据方法',
    type: 'TextArea'
  }]
  const handleUserSearch = (params) => {
    readUsers(
      params,
      ({data: {data: {user}}}) => {
        setUserOptions(user.map(({user_id: value, nick_name: label}) => ({label, value})))
      }
    )
  }
  const auditTeamColumns = [
    {
      dataIndex: 'team_name',
      title: '审核组名称',
      type: 'Input',
      width: 200
    },
    {
      dataIndex: 'group_leader',
      title: '审核组长',
      type: 'Select',
      width: 120,
      props: (text) => ({
        showSearch: true,
        filterOption: false,
        onSearch: (value) => value && handleUserSearch({value}),
        options: userOptions
      })
    },
    {
      dataIndex: 'team_members',
      title: '审核组员',
      type: 'MultiSelect',
      props: (text) => ({
        showCheckAll: false,
        showSearch: true,
        filterOption: false,
        onSearch: (value) => value && handleUserSearch({value}),
        options: userOptions
      })
    }
  ]
  const auditScheduleColumns = [
    {
      dataIndex: 'time',
      title: '时间',
      width: 350,
      type: 'DatePicker.RangePicker',
    },
    {
      dataIndex: 'process_activity',
      title: '受审核的过程及主要活动',
      width: 260,
      type: 'MultiSelect',
      props: {
        options: [...dutiesOptions, {label: '首次会议', value: '首次会议'}, {label: '末次会议', value: '末次会议'}],
        optionLabelProp: 'value'
      }
    },
    {
      dataIndex: 'department',
      title: '涉及主要部门',
      type: 'Select',
      width: 200,
      props: {
        options: deptOptions
      }
    },
    {
      dataIndex: 'auditor',
      title: '审核员',
      type: 'Select',
      width: 120,
      props: {
        options: [...auditTeamTbData.map(item => ({
          label: item.team_name,
          value: item.team_name
        })), {label: '全体人员', value: '全体人员'}]
      }
    },
    {
      dataIndex: 'clause',
      title: '相关标准条款',
      type: 'Input',
      width: 200,
    },
    {
      dataIndex: 'note',
      title: '备注',
      type: 'Input'
    },
  ]
  const formItems = [
    [
      {
        span: 12,
        label: '审核目的',
        name: 'purpose',
        formItem: <Input.TextArea></Input.TextArea>
      },
      {
        span: 12,
        label: '审核范围',
        name: 'scope',
        formItem: <Input.TextArea></Input.TextArea>
      },
    ],
    [{
      span: 24,
      formItem: (
        <EditTable
          isDisabled={isDisabled}
          title={() => "审核准则依据方法："}
          columns_text={criteriaColumns}
          dataSource={criteriaTbData}
          setTbData={setCriteriaTbData}>
        </EditTable>
      )
    }],
    [{
      span: 24,
      formItem: (
        <EditTable
          isDisabled={isDisabled}
          title={() => "审核组："}
          columns_text={auditTeamColumns}
          dataSource={auditTeamTbData}
          setTbData={setAuditTeamTbData}>
        </EditTable>
      )
    }],
    [
      {
        span: 12,
        label: '审核时间',
        name: 'review_time',
        getValueProps: value => ({value: value && value.map(i => i && dayjs(i))}),
        normalize: value => value.map(i => i && dayjs(i).format('YYYY-MM-DD')),
        formItem: <DatePicker.RangePicker></DatePicker.RangePicker>
      },
      {
        span: 12,
        label: '首次会议时间',
        name: ['first_meeting_time'],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
        formItem: (
          <DatePicker showTime></DatePicker>
        )
      },
    ],
    [
      {
        span: 12,
        label: '末次会议时间',
        name: ['last_meeting_time'],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
        formItem: (
          <DatePicker showTime></DatePicker>
        )
      },
      {
        span: 12,
        label: '审核报告发布日期',
        name: ['release_date'],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        formItem: (
          <DatePicker></DatePicker>
        )
      },
    ],
    [{
      span: 24,
      formItem: (
        <EditTable
          isDisabled={isDisabled}
          title={() => "审核日程表："}
          columns_text={auditScheduleColumns}
          dataSource={auditScheduleTbData}
          setTbData={setAuditScheduleTbData}>
        </EditTable>
      )
    }],
  ]
  // 暴露表单实例方法给父组件
  useImperativeHandle(ref, () => ({
    getFieldsValue: (...args) => {
      const nowFormData = form.getFieldsValue(...args)
      return {
        ...formData,
        ...nowFormData,
        criteria_methods: criteriaTbData.map(({key, ...rest}) => rest),
        audit_team: auditTeamTbData.map(({key, ...rest}) => rest),
        audit_schedule: auditScheduleTbData.map(({key, ...rest}) => rest)
      }
    },
    resetFields: (...args) => {
      form.resetFields(...args)
      setCriteriaTbData([])
      setAuditTeamTbData([])
      setAuditScheduleTbData([])
    },
  }));
  useEffect(() => {
    const {criteria_methods, audit_team, audit_schedule} = formData
    const userList = []
    setCriteriaTbData(criteria_methods.map((item) => ({...item, key: item.method})))
    setAuditTeamTbData(audit_team.map((item) => {
      const {group_leader, team_members} = item
      typeof group_leader === 'number' && userList.push(group_leader)
      userList.push(...(team_members ?? []))
      return {...item, key: item.team_name}
    }))
    setAuditScheduleTbData(audit_schedule.map((item, index) => ({...item, key: index})))
    handleUserSearch({user_id: Array.from(new Set(userList)).join()})
    form.setFieldsValue(formData)
  }, [formData]);
  return (
    <CustomForm
      disabled={isDisabled}
      form={form}
      formItems={formItems}
    ></CustomForm>
  );
})
export default PlanForm;
