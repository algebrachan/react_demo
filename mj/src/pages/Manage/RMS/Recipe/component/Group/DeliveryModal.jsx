import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Select, Upload} from 'antd'
import {useEffect, useMemo, useState} from 'react'
import dayjs from 'dayjs'
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import MultiSelect from "@/pages/Manage/RMS/component/MultiSelect.jsx";
import {
  createDeviceType,
  createRecipeGroup,
  createRecipeTemplate,
  deliveryRecipeFile,
  readUnboundDeviceList,
  updateDeviceType,
  updateRecipeGroup,
  updateRecipeTemplate
} from '@/apis/rms.js'
import {UploadOutlined} from '@ant-design/icons'

const DeliveryModal = ({open, setOpen, groupRow, docRow, deviceList, DeliveryTypeOptions}) => {
  const deviceListOptions = useMemo(() => {
    const {DeviceIdArray} = groupRow
    return deviceList
    .filter(({DeviceId}) => DeviceIdArray?.includes(DeviceId))
    .map(({DeviceId, DisplayName}) => ({label: DisplayName, value: DeviceId}))
  }, [groupRow, deviceList])
  const [form] = Form.useForm()
  const formItems = [
    [
      {
        span: 24,
        label: '下发方式',
        rules: [{required: true, message: '请选择下发方式'}],
        name: 'IssureType',
        formItem: <Radio.Group options={DeliveryTypeOptions} />
      }
    ],
    [
      {
        span: 24,
        label: '下发设备',
        rules: [{required: true, message: '请选择绑定设备'}],
        name: 'DeviceIds',
        formItem: <MultiSelect showCheckAll={true} options={deviceListOptions} />
      }
    ],
  ]
  const handleOk = () => {
    form.validateFields().then(async values => {
      const {RecipeFileId} = docRow
      deliveryRecipeFile({RecipeFileId, ...values})
      .then(res => {
        message.success('配方文件已下发')
        setOpen(false)
      })
    })
  }
  useEffect(() => {
    if (open) {
      const {DeviceIdArray, DeliveryType} = groupRow
      form.setFieldsValue({DeviceIds: DeviceIdArray, IssureType: DeliveryType})
    }
  }, [open])
  return (
    <Modal
      title={'配方文件下发'}
      open={open}
      onOk={() => handleOk()}
      onCancel={() => setOpen(false)}
      width={500}>
      <CustomForm
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{span: 4}}
      />
    </Modal>
  )
}
export default DeliveryModal;
