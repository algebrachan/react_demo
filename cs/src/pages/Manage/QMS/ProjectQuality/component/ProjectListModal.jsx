import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {readUsers} from '@/apis/auth_api.jsx'
import {create_project_quality, update_project_quality} from '@/apis/qms_router.jsx'

const ProjectListModal = ({isEdit, open, setOpen, refresh, row}) => {
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
        label: '项目名称',
        rules: [{required: true, message: '请选择项目名称'}],
        name: 'project_name',
        formItem: <Input />
      }
    ],
    [
      {
        span: 24,
        label: '项目编号',
        name: 'project_code',
        rules: [{required: true, message: '请输入项目编号'}],
        formItem: <Input />
      },
    ],
    [
      {
        span: 24,
        label: '项目负责人',
        name: 'project_charge_person',
        rules: [{required: true, message: '请选择项目负责人'}],
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
        label: '项目计划时间',
        rules: [{required: true, message: '请选择项目计划时间'}],
        getValueProps: value => ({value: value && value.map(i => dayjs(i))}),
        normalize: value => value && value.map(i => `${dayjs(i).format('YYYY-MM-DD')}`),
        formItem: <DatePicker.RangePicker />
      }
    ],
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      const {date_range: [project_plan_start, project_plan_end], ...rest} = values
      if (isEdit) {
        update_project_quality({id: row.id, project_plan_start, project_plan_end, ...rest}, res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        create_project_quality({project_plan_start, project_plan_end, ...rest}, res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      const {project_plan_start, project_plan_end, ...rest} = row
      form.setFieldsValue({date_range: [project_plan_start, project_plan_end], ...rest})
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
export default ProjectListModal;
