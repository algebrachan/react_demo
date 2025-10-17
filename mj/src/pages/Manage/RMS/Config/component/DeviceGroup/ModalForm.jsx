import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import {createDeviceGroup, createDeviceType, updateDeviceGroup, updateDeviceType} from '@/apis/rms.js'

const ModalForm = ({isEdit, open, setOpen, refresh, row, deviceTypeList}) => {
  const [form] = Form.useForm()
  const formItems = [
    [
      {
        span: 24,
        label: '设备组名称',
        rules: [{required: true, message: '请输入设备组名称'}],
        name: 'DisplayName',
        formItem: <Input />
      }
    ],
    [
      {
        span: 24,
        label: '设备类型',
        rules: [{required: true, message: '请选择设备类型'}],
        name: 'DeviceTypeId',
        formItem: <Select options={deviceTypeList.map(({DisplayName, Id}) => ({label: DisplayName, value: Id}))} />
      },
    ],
    [
      {
        span: 24,
        label: '备注',
        name: 'Description',
        formItem: <Input.TextArea rows={5} />
      },
    ],
    // [
    //   {
    //     span: 24,
    //     name: 'date_range',
    //     label: '项目计划时间',
    //     rules: [{required: true, message: '请选择项目计划时间'}],
    //     getValueProps: value => ({value: value && value.map(i => dayjs(i))}),
    //     normalize: value => value && value.map(i => `${dayjs(i).format('YYYY-MM-DD')}`),
    //     formItem: <DatePicker.RangePicker />
    //   }
    // ],
  ]
  const handleOk = () => {
    form.validateFields().then(values => {
      if (isEdit) {
        const {Id, key, Index, ...rest} = row
        updateDeviceGroup({...rest, ...values})
        .then(res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        createDeviceGroup(values)
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
      title={`${isEdit ? '编辑设备分组' : '新增设备分组'}`}
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
