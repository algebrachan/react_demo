import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {DatePicker, Form, Input, InputNumber, message, Modal, Select} from 'antd'
import {useEffect, useState} from 'react'
import {createMSAYearPlan, updateMSAYearPlan} from '../../../../../../apis/qms_router.jsx'
import dayjs from 'dayjs'

const YearPlanModal = ({
  isEdit,
  visible,
  setVisible,
  refresh,
  row
}) => {
  const [form] = Form.useForm()
  const formItems = [
    [
      {
        span: 12,
        label: '计划年份',
        name: 'year',
        rules: [{required: true, message: '请输入计划年份'}],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY')}`,
        formItem: <DatePicker picker="year" />
      },
      {
        span: 12,
        label: '版本',
        name: 'version',
        formItem: <Input />
      }
    ],
    [
      {
        span: 12,
        label: '项目名称',
        name: 'project_name',
        rules: [{required: true, message: '请输入项目名称'}],
        formItem: <Input />
      },
      {
        span: 12,
        label: '产品名称',
        name: 'product_name',
        rules: [{required: true, message: '请输入产品名称'}],
        formItem: <Input />
      }
    ],
    [
      {
        span: 12,
        label: '产品规格',
        name: 'product_spec',
        rules: [{required: true, message: '请输入产品规格'}],
        formItem: <Input />
      },
    ]
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        const {key, ...rest} = row
        updateMSAYearPlan({...rest, ...values}, () => {
          message.success(`编辑成功`)
          setVisible(false)
          refresh()
        })
      } else {
        createMSAYearPlan({...values}, () => {
          message.success(`添加成功`)
          setVisible(false)
          form.resetFields()
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && visible) {
      form.setFieldsValue(row)
    } else if (!isEdit && visible) {
      form.resetFields()
    }
  }, [visible])
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={visible}
      onOk={() => handleOk()}
      onCancel={() => setVisible(false)}
      width={800}>
      <CustomForm
        form={form}
        formItems={formItems}
      />
    </Modal>
  )
};
export default YearPlanModal;
