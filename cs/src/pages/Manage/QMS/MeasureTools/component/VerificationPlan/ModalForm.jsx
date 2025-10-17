import {DatePicker, Form, Input, InputNumber, Modal, Select, message, Upload, Button} from 'antd'
import CustomForm from '../../../../../../components/CustomSeries/CustomForm.jsx'
import {calibrationStatus, calibrationType, isTrue, measureTypes as typeOptions} from '../../dict.js'
import {editVerificationPlan, uploadToolsLedger} from '../../../../../../apis/qms_router.jsx'
import dayjs from 'dayjs'
import {useEffect, useState} from 'react'

const ModalForm = ({isEdit, visible, setVisible, refresh, row}) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([]);
  const formItems = [
    [
      {
        span: 6,
        label: '计划名称',
        name: 'verification_name',
        formItem: <Input />
      },
      {
        span: 6,
        label: '管理编号',
        name: 'management_number',
        rules: [{required: true, message: '请输入管理编号'}],
        formItem: <Input disabled={isEdit} />
      },
      {
        span: 6,
        label: '量具名称',
        name: 'measuring_tool_name',
        rules: [{required: true, message: '请输入量具名称'}],
        formItem: <Input disabled={isEdit} />
      },
      {
        span: 6,
        label: '保质期（月）',
        name: 'quality_guarantee_period',
        formItem: <InputNumber />
      },
    ],
    [
      {
        span: 6,
        label: '校准状态',
        name: 'calibration_status',
        formItem: <Select options={calibrationStatus} />
      },
      {
        span: 6,
        label: '预警标识',
        name: 'warning_signs',
        formItem: <Input />
      },
      {
        span: 6,
        label: '二级提醒人',
        name: 'reminder_level_tow',
        formItem: <Input disabled={isEdit} />
      },
      {
        span: 6,
        label: '三级提醒人',
        name: 'reminder_level_three',
        formItem: <Input disabled={isEdit} />
      },
    ],
    [
      {
        span: 6,
        label: '计量管理员',
        name: 'metrology_administrator',
        formItem: <Input />
      },
      {
        span: 6,
        label: '有效日期',
        name: 'effective_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
        formItem: <DatePicker />
      },
      {
        span: 6,
        label: '校准日期',
        name: 'calibration_date',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD')}`,
        formItem: <DatePicker />
      },
      {
        span: 6,
        label: '审批时间',
        name: 'approval_time',
        getValueProps: value => ({value: value && dayjs(value)}),
        normalize: value => value && `${dayjs(value).format('YYYY-MM-DD HH-mm-ss')}`,
        formItem: <DatePicker showTime />
      },
    ],
    [
      {
        span: 6,
        label: '校准方式',
        name: 'calibration_type',
        formItem: <Select options={calibrationType} />
      },
      {
        span: 6,
        label: '校准周期（月）',
        name: 'calibration_cycle',
        formItem: <InputNumber />
      },
      {
        span: 6,
        label: '校准结果',
        name: 'calibration_results',
        formItem: <Select options={typeOptions} />
      },
      {
        span: 6,
        label: '校准结果说明',
        name: 'calibration_results_notes',
        formItem: <Input />
      },
    ],
    [
      {
        span: 6,
        label: '使用人',
        name: 'user',
        formItem: <Input />
      },
      {
        span: 6,
        label: '送检人',
        name: 'inspection_submitter',
        formItem: <Input />
      },
      {
        span: 6,
        label: '校准报告',
        name: 'calibration_report',
        formItem: (
          <Upload
            maxCount={1}
            fileList={fileList}
            onRemove={() => {setFileList([])}}
            beforeUpload={file => {
              setFileList([file])
              return false
            }}
          >
            <Button>点击上传</Button>
          </Upload>
        )
      },
      {
        span: 6,
        label: '校准机构',
        name: 'calibration_agency',
        formItem: <Input />
      },
    ]
  ]
  const isFile = (file) => {
    return Object.prototype.toString.call(file) === '[object File]'
  }
  const uploadFile = (id) => {
    const todo = () => {
      message.success(`${isEdit ? '编辑' : '添加'}成功`)
      setVisible(false)
      form.resetFields()
      refresh()
    }
    const [file] = fileList
    if (isFile(file)) {
      const formData = new FormData()
      formData.append('file', file)
      uploadToolsLedger({id, typeof: 2}, formData, (res) => {
        todo()
      })
    } else if (isEdit && file === undefined) {
      uploadToolsLedger({id, typeof: 2}, undefined, (res) => {
        todo()
      })
    } else {
      todo()
    }
  }
  const handleOk = () => {
    form.validateFields().then(values => {
      const {calibration_report, ...rest} = values
      const {id, equipment_ledger_id} = row
      if (isEdit) {
        editVerificationPlan({id, equipment_ledger_id, ...rest}, () => {
          uploadFile(row.id)
        })
      }
    })
  }
  useEffect(() => {
    if (isEdit && visible) {
      const {calibration_report} = row
      setFileList(calibration_report ? [{name: calibration_report}] : [])
      form.setFieldsValue(row)
    } else if (!isEdit && visible) {
      form.resetFields()
      setFileList([])
    }
  }, [visible])
  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}`}
      open={visible}
      onOk={() => handleOk()}
      onCancel={() => setVisible(false)}
      width={1500}>
      <CustomForm
        form={form}
        formItems={formItems}
        labelAlign="right"
        labelCol={{span: 10}}
      />
    </Modal>
  )
}
export default ModalForm;
