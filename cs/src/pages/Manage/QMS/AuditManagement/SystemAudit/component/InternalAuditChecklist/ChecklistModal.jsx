import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {isTrue, measureTypes as typeOptions} from '../../../../MeasureTools/dict.js'
import {
  addToolsLedger,
  create_audit_checklist,
  editToolsLedger,
  update_audit_checklist,
  uploadToolsLedger
} from '../../../../../../../apis/qms_router.jsx'
import CustomForm from '../../../../../../../components/CustomSeries/CustomForm.jsx'
import MultiSelect from '../../../../../../../components/CustomSeries/MultiSelect.jsx'
import {dutiesOptions} from '../../../SchemeManagement/SchemeForm/index.jsx'
import {readUsers} from '../../../../../../../apis/auth_api.jsx'
import {deptOptions} from './index.jsx'

const ChecklistModal = ({isEdit, open, setOpen, refresh, row, planInfo}) => {
  const [form] = Form.useForm()
  const [userOptions, setUserOptions] = useState([])
  const teamOptions = planInfo.audit_team?.map(({team_name: value}) => ({label: value, value}))
  const handleUserSearch = (value) => {
    readUsers({value}, ({data: {data: {user}}}) => {
      setUserOptions(user.map(({user_id: value, nick_name: label}) => ({label, value})))
    })
  }
  const formItems = [
    [
      {
        span: 12,
        label: '受审部门',
        rules: [{required: true, message: '请选择受审部门'}],
        name: 'audited_department',
        formItem: <Select options={deptOptions} onChange={(value) => {
          const checkedSchedule = planInfo.audit_schedule.find(({department}) => department === value)
          if (checkedSchedule) {
            form.setFieldsValue({
              reviewer: [checkedSchedule.auditor],
              procedure_name: checkedSchedule.process_activity
            })
          }
        }}/>
      },
      {
        span: 12,
        label: '审核人员',
        name: 'reviewer',
        rules: [{required: true, message: '请输入审核人员'}],
        formItem: <MultiSelect options={teamOptions}/>
      },
    ],
    [
      {
        span: 12,
        label: '过程名称',
        name: 'procedure_name',
        rules: [{required: true, message: '请输入过程名称'}],
        formItem: <MultiSelect options={dutiesOptions} optionLabelProp={'value'}/>
      },
      {
        span: 12,
        label: '过程程序及编号',
        name: 'procedure_number',
        formItem: <Input/>
      }
    ],
    [
      {
        span: 12,
        label: '陪同人员',
        name: 'accompanying_personnel',
        formItem: (
          <MultiSelect
            showSearch={true}
            filterOption={false}
            onSearch={(value) => value && handleUserSearch(value)}
            options={userOptions}
          />
        )
      },
      {
        span: 12,
        label: '审核日期',
        name: 'approved_date',
        rules: [{required: true, message: '请输入审核日期'}],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
        formItem: <DatePicker/>
      },
    ]
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        update_audit_checklist({id: row.id, ...values}, res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        create_audit_checklist({review_plan_id: planInfo.id, ...values}, res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      const {accompanying_personnel} = row
      setUserOptions((accompanying_personnel ?? []).map(({user_id, nick_name}) => ({label: nick_name, value: user_id})))
      form.setFieldsValue({...row, accompanying_personnel: (accompanying_personnel ?? []).map(({user_id}) => user_id)})
    } else if (!isEdit && open) {
      form.resetFields()
    }
  }, [open])
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={open}
      onOk={() => handleOk()}
      onCancel={() => setOpen(false)}
      width={800}>
      <CustomForm
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{span: 8}}
      />
    </Modal>
  )
}
export default ChecklistModal;
