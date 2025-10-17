import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {readUsers} from '@/apis/auth_api.jsx'
import {create_stage_quality, update_stage_quality} from '@/apis/qms_router.jsx'

const StageListModal = ({isEdit, open, setOpen, refresh, row, projectInfo}) => {
  const [form] = Form.useForm()
  const [userOptions, setUserOptions] = useState([])
  const handleUserSearch = (value) => {
    readUsers({value}, ({data: {data: {user}}}) => {
      setUserOptions(user.map(({nick_name: label}) => ({label, value: label})))
    })
  }
  const formItems = [
    [
      {
        span: 24,
        label: '阶段名称',
        rules: [{required: true, message: '请选择阶段名称'}],
        name: 'stage_name',
        formItem: <Input />
      }
    ],
    [
      {
        span: 24,
        label: '阶段编号',
        name: 'stage_code',
        rules: [{required: true, message: '请输入阶段编号'}],
        formItem: <Input />
      },
    ],
    [
      {
        span: 24,
        label: '阶段负责人',
        name: 'stage_charge_person',
        rules: [{required: true, message: '请选择阶段负责人'}],
        formItem: (
          <Select
            showSearch={true}
            filterOption={false}
            onSearch={(value) => value && handleUserSearch(value)}
            options={userOptions}
          />
        )
      }
    ],
    [
      {
        span: 24,
        name: 'date_range',
        label: '阶段计划时间',
        rules: [{required: true, message: '请选择阶段计划时间'}],
        getValueProps: value => ({value: value && value.map(i => dayjs(i))}),
        normalize: value => value && value.map(i => `${dayjs(i).format('YYYY-MM-DD')}`),
        formItem: <DatePicker.RangePicker />
      }
    ],
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      const {date_range: [stage_plan_start, stage_plan_end], ...rest} = values
      if (isEdit) {
        update_stage_quality({id: row.stage_id, stage_plan_start, stage_plan_end, ...rest}, res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        create_stage_quality({project_id: projectInfo.id, stage_plan_start, stage_plan_end, ...rest}, res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      const {stage_plan_start, stage_plan_end, ...rest} = row
      form.setFieldsValue({date_range: [stage_plan_start, stage_plan_end], ...rest})
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
      width={500}>
      <CustomForm
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{span: 7}}
      />
    </Modal>
  )
}
export default StageListModal;
