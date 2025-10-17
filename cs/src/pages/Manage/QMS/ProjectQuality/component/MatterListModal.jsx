import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {readUsers} from '@/apis/auth_api.jsx'
import {create_matter_quality, create_project_quality, update_matter_quality, update_project_quality} from '@/apis/qms_router.jsx'
import {UploadOutlined} from '@ant-design/icons'

const MatterListModal = ({isEdit, open, setOpen, refresh, row}) => {
  const [form] = Form.useForm()
  const formItems = [
    [
      {
        span: 24,
        label: '事项名称',
        rules: [{required: true, message: '请输入事项名称'}],
        name: 'matter_name',
        formItem: <Input />
      }
    ],
    [
      {
        span: 24,
        label: '附件上传',
        valuePropName: 'fileList',
        name: 'file_info',
        rules: [{required: true, message: '请上传附件'}],
        formItem: (
          <Upload
            onChange={({file}) => {
              form.setFieldsValue({file_info: [file]})
            }}
            beforeUpload={() => false}
            maxCount={1}
          ><Button icon={<UploadOutlined />}> 点击上传</Button></Upload>
        )
      },
    ]
  ]
  const isFile = (file) => {
    return Object.prototype.toString.call(file) === '[object File]'
  }
  const handleOk = () => {
    form.validateFields().then(values => {
      const {file_info: [file], matter_name} = values
      const formData = new FormData()
      isFile(file) && formData.append('file', file)
      if (isEdit) {
        formData.append('quality_matter', JSON.stringify({id: row.matter_id, matter_name}))
        update_matter_quality(
          formData,
          () => {
            message.success(`编辑成功`)
            setOpen(false)
            refresh()
          }
        )
      } else {
        formData.append('quality_matter', JSON.stringify({stage_id: row.stage_id, matter_name}))
        create_matter_quality(
          formData,
          () => {
            message.success(`添加成功`)
            setOpen(false)
            refresh()
          }
        )
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      const {matter_name, file_name} = row
      form.setFieldsValue({matter_name, file_info: [{name: file_name}]})
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
export default MatterListModal;
