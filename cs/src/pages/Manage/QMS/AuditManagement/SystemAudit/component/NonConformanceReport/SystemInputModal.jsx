import {DatePicker, Form, Input, message, Modal, Select} from 'antd'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import MultiSelect from '../../../../../../../components/CustomSeries/MultiSelect.jsx'
import {readUsers} from '../../../../../../../apis/auth_api.jsx'
import {
  create_audit_checklist,
  create_non_conformance,
  update_audit_checklist,
  update_non_conformance
} from '../../../../../../../apis/qms_router.jsx'
import {dutiesOptions} from '../../../SchemeManagement/SchemeForm/index.jsx'
import {deptOptions} from '../InternalAuditChecklist/index.jsx'

const NonConformanceClass = [
  {
    label: '严重不符合项',
    value: '严重不符合项'
  },
  {
    label: '一般不符合项',
    value: '一般不符合项'
  },
  {
    label: '轻微不符合项',
    value: '轻微不符合项'
  },
  {
    label: '建议项',
    value: '建议项'
  }
]
const SystemInputModal = ({isEdit, open, setOpen, refresh, row, planInfo}) => {
  const [form] = Form.useForm();
  const [accompanyUserOptions, setAccompanyUserOptions] = useState([])
  const [chargeUserOptions, setChargeUserOptions] = useState([])
  const teamOptions = planInfo.audit_team?.map(({team_name: value}) => ({label: value, value}))
  const handleUserSearch = (value) => {
    readUsers({value}, ({data: {data: {user}}}) => {
      setChargeUserOptions(user.map(({user_id: value, nick_name: label}) => ({label, value})))
    })
  }
  const handleAccompanyUserSearch = (value) => {
    readUsers({value}, ({data: {data: {user}}}) => {
      setAccompanyUserOptions(user.map(({user_id: value, nick_name: label}) => ({label, value})))
    })
  }
  const createItems = [
    [
      {
        span: 12,
        label: '检查要点',
        rules: [{required: true, message: '请输入检查要点'}],
        name: 'inspection_point',
        formItem: <Select options={dutiesOptions} />
      },
      {
        span: 12,
        label: '支持过程',
        rules: [{required: true, message: '请输入检查要点'}],
        name: 'process',
        formItem: <Input />
      }
    ],
    [
      {
        span: 12,
        label: '标准条款',
        name: 'standard_terms',
        rules: [{required: true, message: '请输入标准条款'}],
        formItem: <Input />
      },
      {
        span: 12,
        label: '审核记录',
        name: 'audit_records',
        rules: [{required: true, message: '请输入审核记录'}],
        formItem: <Input.TextArea onBlur={(e) => form.setFieldValue(['description'], e.target.value)} rows={1} />
      }
    ]
  ]
  const formItems = [
    [
      {
        span: 12,
        label: '不合格等级',
        name: 'non_conformance_class',
        rules: [{required: true, message: '请选择不合格等级'}],
        formItem: <Select options={NonConformanceClass} />
      },
      {
        span: 12,
        label: '受审核方',
        name: 'auditee',
        rules: [{required: true, message: '请选择受审核方'}],
        formItem: <Select disabled={isEdit} options={deptOptions} onChange={(value) => {
          const checkedSchedule = planInfo.audit_schedule.find(({department}) => department === value)
          if (checkedSchedule) {
            form.setFieldsValue({
              auditor: [checkedSchedule.auditor],
            })
          }
        }} />
      }
    ],
    [
      {
        span: 12,
        label: '审核日期',
        name: 'approved_date',
        rules: [{required: true, message: '请选择审核日期'}],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        formItem: <DatePicker disabled={isEdit} />
      },
      {
        span: 12,
        label: '审核员',
        name: 'auditor',
        rules: [{required: true, message: '请输入审核员'}],
        formItem: <MultiSelect disabled={isEdit} options={teamOptions} />
      }
    ],
    [
      {
        span: 12,
        label: '问题发生地点',
        name: 'location_of_problem',
        formItem: <Input />
      },
      {
        span: 12,
        label: '陪同人员',
        name: 'accompanying_personnel',
        formItem: (
          <MultiSelect
            showSearch={true}
            filterOption={false}
            onSearch={(value) => value && handleAccompanyUserSearch(value)}
            disabled={isEdit}
            options={accompanyUserOptions} />
        )
      }
    ],
    [
      {
        span: 12,
        label: '整改计划完成时间',
        name: 'planned_completion_time',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
        rules: [{required: true, message: '请选择整改计划完成时间'}],
        formItem: <DatePicker />
      },
      {
        span: 12,
        label: '担当人',
        name: 'person_in_charge',
        rules: [{required: true, message: '请选择担当人'}],
        formItem: (
          <Select
            showSearch={true}
            filterOption={false}
            onSearch={(value) => value && handleUserSearch(value)}
            options={chargeUserOptions}
          />
        )
      }
    ],
    [
      {
        span: 12,
        label: '不符合项描述',
        name: 'description',
        formItem: <Input.TextArea rows={4} />
      }
    ]
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        update_non_conformance({...row, ...values}, res => {
          message.success(`体系填写成功`)
          setOpen(false)
          refresh()
        })
      } else {
        create_non_conformance({review_plan_id: planInfo.id, ...values}, res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (open && isEdit) {
      const {accompanying_personnel, person_in_charge, person_in_change_name} = row
      setAccompanyUserOptions((accompanying_personnel ?? []).map(({user_id, nick_name}) => ({
        label: nick_name,
        value: user_id
      })))
      person_in_charge && setChargeUserOptions([{label: person_in_change_name, value: person_in_charge}])
      form.setFieldsValue({...row, accompanying_personnel: (accompanying_personnel ?? []).map(({user_id}) => user_id)})
    } else if (open) {
      form.resetFields()
    }
  }, [open])
  return (
    <Modal
      width={800}
      title={isEdit ? '不符合项体系填写' : '新建不符合项'}
      open={open}
      onCancel={() => setOpen(false)}
      onOk={() => handleOk()}>
      <CustomForm
        labelAlign="right"
        labelCol={{span: 9}}
        form={form}
        formItems={!isEdit ? [...createItems, ...formItems] : formItems}>
      </CustomForm>
    </Modal>
  );
};
export default SystemInputModal;
