import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import {createDeviceType, updateDeviceType} from '@/apis/rms.js'

const ModalForm = ({isEdit, open, setOpen, refresh, row}) => {
  const [form] = Form.useForm()
  const formItems = [
    [
      {
        span: 24,
        label: '设备类型名称',
        rules: [{required: true, message: '请输入设备类型名称'}],
        name: 'DisplayName',
        formItem: <Input />
      }
    ],
    [
      {
        span: 24,
        label: '备注',
        name: 'Description',
        formItem: <Input.TextArea rows={5} />
      },
    ]
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        const {key, Index, ...rest} = row
        updateDeviceType({...rest, ...values})
        .then(res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        createDeviceType(values)
        .then(res => {
          message.success(`添加成功`)
          setOpen(false)
          refresh()
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      form.setFieldsValue({...row})
    } else if (!isEdit && open) {
      form.resetFields()
    }
  }, [open])
  return (
    <Modal
      title={`${isEdit ? '编辑设备类型' : '新增设备类型'}`}
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
export default ModalForm;
