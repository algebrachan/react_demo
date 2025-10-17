import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import CustomForm from "@/pages/Manage/RMS/component/CustomSeries/CustomForm.jsx";
import {createDeviceType, createRecipeFile, createRecipeTemplate, updateDeviceType, updateRecipeFile, updateRecipeTemplate} from '@/apis/rms.js'
import {UploadOutlined} from '@ant-design/icons'

const DocModal = ({isEdit, open, setOpen, refresh, docRow, groupRow}) => {
  const [form] = Form.useForm()
  const formItems = [
    [
      {
        span: 24,
        label: '上传文件',
        valuePropName: 'fileList',
        rules: [{required: true, message: '请上传文件'}],
        name: 'RecipeFileContent',
        formItem: (
          <Upload
            accept={'.csv'}
            onChange={({file, fileList}) => {
              const fileLength = fileList.length
              if (fileLength) {
                if (file.name.endsWith('.csv') || file.name.endsWith('.CSV')) {
                  form.setFieldsValue({RecipeFileContent: [file], RecipeFileName: file.name})
                } else {
                  form.setFieldsValue({RecipeFileContent: [], RecipeFileName: undefined})
                  message.error('模板文件仅限 .csv 文件，请重新上传', 3)
                }
              } else {
                form.setFieldsValue({RecipeFileContent: [], RecipeFileName: undefined})
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
        name: 'RecipeFileName',
        formItem: <Input disabled />
      }
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
      const {RecipeFileContent: [RecipeFileContent], RecipeFileName} = values
      const isNewFile = isFile(RecipeFileContent)
      let newRecipeFileContent = null
      let newRecipeFileName = ''
      if (isNewFile) {
        newRecipeFileContent = await convertFile2Base64(RecipeFileContent)
        newRecipeFileName = RecipeFileName
      }
      if (isEdit) {
        const {RecipeFileId} = docRow
        if (isNewFile) {
          updateRecipeFile({RecipeFileId, RecipeFileContent: newRecipeFileContent, RecipeFileName: newRecipeFileName})
          .then(res => {
            message.success(`编辑成功`)
            setOpen(false)
            refresh()
          })
        } else {
          setOpen(false)
        }
      } else {
        if (isNewFile) {
          createRecipeFile({RecipeGroupId: groupRow.RecipeGroupId, RecipeFileContent: newRecipeFileContent, RecipeFileName: newRecipeFileName})
          .then(res => {
            message.success(`添加成功`)
            setOpen(false)
            refresh()
          })
        }
      }
    })
  }
  useEffect(() => {
    if (isEdit && open) {
      const {RecipeFileName} = docRow
      form.setFieldsValue({RecipeFileContent: [{name: RecipeFileName, status: 'done'}], RecipeFileName})
    } else if (!isEdit && open) {
      form.resetFields()
    }
  }, [open])
  return (
    <Modal
      title={`${isEdit ? '编辑配方文件' : '新增配方文件'}`}
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
export default DocModal;
