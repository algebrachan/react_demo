import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import {createDevice, createDeviceGroup, createDeviceType, updateDevice, updateDeviceGroup, updateDeviceType} from '@/apis/rms.js'

const ModalForm = ({isEdit, open, setOpen, refresh, row, deviceTypeList, deviceGroupList, areaList, EnableDict}) => {
  const [form] = Form.useForm()
  const [groupOptions, setGroupOptions] = useState([])
  const handleFormChange = (changedValues, allValues) => {
    const {DeviceTypeId} = changedValues
    if (DeviceTypeId !== undefined) {
      const groupOptions = deviceGroupList.filter(item => item.DeviceTypeId === DeviceTypeId)
      setGroupOptions(groupOptions.map(item => ({label: item.DisplayName, value: item.Id})))
      form.setFieldValue(['DeviceGroupId'], groupOptions[0]?.Id ?? undefined)
    }
  }
  const formItems = [
    [
      {
        span: 24,
        label: '设备Id',
        rules: [{required: true, message: '请输入设备Id'}],
        name: 'DeviceId',
        formItem: <InputNumber controls={false} disabled={isEdit} />
      }
    ],
    [
      {
        span: 24,
        label: '设备名称',
        rules: [{required: true, message: '请输入设备名称'}],
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
        label: '设备分组',
        name: 'DeviceGroupId',
        formItem: <Select allowClear options={groupOptions} />
      },
    ],
    [
      {
        span: 24,
        label: 'IP地址',
        rules: [{message: '请输入正确的IP地址', pattern: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/}],
        name: 'IpAddress',
        formItem: <Input />
      }
    ],
    [
      {
        span: 24,
        label: '区域名称',
        rules: [{required: true, message: '请选择区域名称'}],
        name: 'AreaId',
        formItem: <Select options={areaList.map(({DisplayName, AreaId}) => ({label: DisplayName, value: AreaId}))} />
      },
    ],
    [
      {
        span: 24,
        label: '状态',
        rules: [{required: true, message: '请选择状态'}],
        name: 'IsEnable',
        formItem: <Radio.Group options={EnableDict} />
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
      let {DeviceGroupId} = values
      DeviceGroupId = DeviceGroupId ? Number(DeviceGroupId.split('-')[1]) : undefined
      if (isEdit) {
        const {Index, ...rest} = row
        updateDevice({...rest, ...values, DeviceGroupId})
        .then(res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        createDevice({...values, DeviceGroupId})
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
      const {DeviceTypeId, DeviceGroupId} = row
      // 设置对应设备类型下的设备分组
      const groupOptions = deviceGroupList.filter(item => item.DeviceTypeId === DeviceTypeId)
      setGroupOptions(groupOptions.map(item => ({label: item.DisplayName, value: item.Id})))
      // 是否是有效的设备分组Id
      const index = deviceGroupList.findIndex(item => item.DeviceGroupId === DeviceGroupId)
      form.setFieldsValue({...row, DeviceGroupId: ~index ? `${DeviceTypeId}-${DeviceGroupId}` : undefined})
    } else if (!isEdit && open) {
      setGroupOptions([])
      form.resetFields()
    }
  }, [open])
  return (
    <Modal
      title={`${isEdit ? '编辑设备' : '新增设备'}`}
      open={open}
      onOk={() => handleOk()}
      onCancel={() => setOpen(false)}
      width={500}>
      <CustomForm
        onValuesChange={handleFormChange}
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{span: 7}}
      />
    </Modal>
  )
}
export default ModalForm;
