import {Button, DatePicker, Form, Input, message, Modal, Select, Upload} from 'antd'
import CustomForm from '@/components/CustomSeries/CustomForm.jsx'
import {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {real_review, update_non_conformance, uploadEvidenceFile} from '@/apis/qms_router.jsx'
import FilePreview from "@/pages/Manage/QMS/ProjectQuality/component/FilePreview.jsx";

const ResponsiblePartyModal = ({open, setOpen, refresh, row}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([])
  const [defaultFileList, setDefaultFileList] = useState([])
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [previewHtmlContent, setPreviewHtmlContent] = useState('')
  const formItems = [
    [
      {
        span: 12,
        label: '原因分析',
        name: 'cause_analysis',
        rules: [{required: true, message: ''}],
        formItem: <Input.TextArea rows={4} />
      },
      {
        span: 12,
        label: '纠正措施',
        name: 'corrective_action',
        rules: [{required: true, message: ''}],
        formItem: <Input.TextArea rows={4} />
      }
    ],
    [
      {
        span: 12,
        label: '预防措施',
        name: 'preventive_measure',
        rules: [{required: true, message: ''}],
        formItem: <Input.TextArea rows={4} />
      },
      {
        span: 12,
        label: '关闭时间',
        name: 'closing_time',
        rules: [{required: true, message: ''}],
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && dayjs(value).format('YYYY-MM-DD'),
        formItem: <DatePicker />
      }
    ],
    [
      {
        span: 12,
        label: '整改证据',
        name: 'rectification_evidence',
        valuePropName: 'fileList',
        rules: [{required: true, message: ''}],
        formItem: (
          <Upload
            onPreview={file => handlePreview(file)}
            defaultFileList={defaultFileList}
            onChange={({fileList}) => form.setFieldsValue({rectification_evidence: fileList})}
            beforeUpload={() => false}
          ><Button>点击上传</Button>
          </Upload>
        )
      }
    ]
  ]
  const handlePreview = async (file) => {
    const formData = new FormData();
    if (Object.prototype.toString.call(file?.originFileObj) === '[object File]') {
      formData.append('file', file.originFileObj);
    } else {
      const {url, name} = file;
      const response = await fetch(url);
      const blob = await response.blob()
      const myFile = new File([blob], name, {type: blob.type});
      formData.append('file', myFile);
    }
    real_review(formData,
      ({data}) => {
        setPreviewHtmlContent(data);
        setPreviewModalOpen(true);
      });
  }
  const handleOk = () => {
    form.validateFields()
    .then(uploadFile)
    .then(rectify_evidence_paths => {
      const {rectification_evidence, ...formData} = form.getFieldsValue()
      update_non_conformance({id: row.id, rectify_evidence_paths, ...formData, status: '3'}, res => {
        message.success(`责任部门确认成功`)
        setOpen(false)
        refresh()
      })
    })
  }
  const handleTempOk = () => {
    const {rectification_evidence, ...formData} = form.getFieldsValue()
    uploadFile()
    .then(rectify_evidence_paths => {
      update_non_conformance({id: row.id, rectify_evidence_paths, ...formData, status: '2.1'}, res => {
        message.success(`保存成功`)
        setOpen(false)
        refresh()
      })
    })
  }
  const uploadFile = () => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      const fullFileList = form.getFieldValue(['rectification_evidence'])
      const fileMap = fullFileList.reduce((acc, file) => {
        if (Object.prototype.toString.call(file?.originFileObj) === '[object File]') acc.unUploadFiles.push(file.originFileObj)
        else acc.uploadFiles.push(file.file_path)
        return acc
      }, {uploadFiles: [], unUploadFiles: []})
      const {uploadFiles, unUploadFiles} = fileMap
      if (unUploadFiles.length > 0) {
        unUploadFiles.forEach(file => formData.append('rectify_evidence', file))
        formData.append('id', JSON.stringify({id: row.id}))
        uploadEvidenceFile(
          undefined,
          formData,
          ({data: {data}}) => resolve([...data.rectify_evidence_paths, ...uploadFiles]),
          () => resolve(uploadFiles))
      } else {
        resolve(uploadFiles)
      }
    })
  }
  useEffect(() => {
    if (open) {
      const {rectification_evidence} = row
      let newRectificationEvidence = []
      if (Array.isArray(rectification_evidence)) {
        newRectificationEvidence = rectification_evidence?.map(item => ({
          name: item.filename,
          url: item.url,
          status: 'done',
          file_path: item.file_path
        })) ?? []
      }
      setDefaultFileList(newRectificationEvidence)
      form.setFieldsValue({...row, rectification_evidence: newRectificationEvidence})
    }
  }, [open])
  return (
    <>
      <Modal
        width={800}
        title={'责任部门填写'}
        okText={'责任部门确认'}
        footer={(originNode, {OkBtn, CancelBtn}) => {
          return (
            <>
              <CancelBtn></CancelBtn>
              <Button type="primary" onClick={handleTempOk}>暂存</Button>
              <OkBtn></OkBtn>
            </>
          )
        }}
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}>
        <CustomForm
          labelAlign="right"
          labelCol={{span: 6}}
          form={form}
          formItems={formItems}>
        </CustomForm>
      </Modal>
      <FilePreview
        htmlContent={previewHtmlContent}
        open={previewModalOpen}
        setOpen={setPreviewModalOpen}
      ></FilePreview>
    </>
  );
};
export default ResponsiblePartyModal;
