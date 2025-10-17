import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import {createDeviceType, createRecipeTemplate, updateDeviceType, updateRecipeTemplate} from '@/apis/rms.js'
import {UploadOutlined} from '@ant-design/icons'

const ModalForm = ({isEdit, open, setOpen, refresh, row, deviceTypeList}) => {
  const [form] = Form.useForm()
  const formItems = [
    [
      {
        span: 24,
        label: '模板名称',
        rules: [{required: true, message: '请输入模板名称'}],
        name: 'TemplateName',
        formItem: <Input />
      }
    ],
    [
      {
        span: 24,
        label: '设备类型',
        rules: [{required: true, message: '请选择设备类型'}],
        name: 'DeviceTypeId',
        formItem: <Select options={deviceTypeList.map(({Id, DisplayName}) => ({label: DisplayName, value: Id}))} />
      }
    ],
    [
      {
        span: 24,
        label: '上传文件',
        valuePropName: 'fileList',
        rules: [{required: true, message: '请上传文件'}],
        name: 'TemplateFile',
        formItem: (
          <Upload
            accept={'.xlsx'}
            onChange={({file, fileList}) => {
              const fileLength = fileList.length
              if (fileLength) {
                if (file.name.endsWith('.xlsx')) {
                  form.setFieldsValue({TemplateFile: [file], TemplateFileName: file.name})
                } else {
                  form.setFieldsValue({TemplateFile: [], TemplateFileName: undefined})
                  message.error('模板文件仅限 .xlsx 文件，请重新上传', 3)
                }
              } else {
                form.setFieldsValue({TemplateFile: [], TemplateFileName: undefined})
              }
            }}
            beforeUpload={() => false}
            maxCount={1}
          ><Button icon={<UploadOutlined />}>点击上传</Button>
          </Upload>
        )
      }
    ],
    [
      {
        span: 24,
        label: '文件名称',
        rules: [{required: true, message: '请输入文件名称'}],
        name: 'TemplateFileName',
        formItem: <Input disabled />
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
  const isFile = (file) => Object.prototype.toString.call(file) === '[object File]'
  const convertFile2Base64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        let unit8Array = new Uint8Array(e.target.result)
        let binaryString = '';
        unit8Array.forEach(byte => {
          binaryString += String.fromCharCode(byte);
        });
        resolve(btoa(binaryString));
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
      fileReader.readAsArrayBuffer(file)
    })
  }
  const handleOk = () => {
    form.validateFields().then(async values => {
      const {TemplateFile: [TemplateFile], TemplateFileName} = values
      let newTemplateFile = null
      let newTemplateFileName = ''
      if (isFile(TemplateFile)) {
        newTemplateFile = await convertFile2Base64(TemplateFile)
        newTemplateFileName = TemplateFileName
      }
      if (isEdit) {
        updateRecipeTemplate({...row, ...values, TemplateFile: newTemplateFile, TemplateFileName: newTemplateFileName})
        .then(res => {
          message.success(`编辑成功`)
          setOpen(false)
          refresh()
        })
      } else {
        createRecipeTemplate({...values, TemplateFile: newTemplateFile, TemplateFileName: newTemplateFileName})
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
      const {TemplateFileName} = row
      form.setFieldsValue({...row, TemplateFile: [{name: TemplateFileName}]})
    } else if (!isEdit && open) {
      form.resetFields()
    }
  }, [open])
  return (
    <Modal
      title={`${isEdit ? '编辑配方模板' : '新增配方模板'}`}
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
